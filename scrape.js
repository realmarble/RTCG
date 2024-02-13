const puppeteer = require("puppeteer");
const fs = require("node:fs");
const antibotbrowser = require("antibotbrowser");
(async () => {
  // Launch a headless browser
  const antibrowser = await antibotbrowser.startbrowser();
  let characters = [];
  const browser = await puppeteer.connect({
    browserWSEndpoint: antibrowser.websokcet,
  });
  let charobjs = [];
  try {
    // Open a new page
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    // Navigate to the target URL
    await page.goto("https://en.touhouwiki.net/wiki/Characters", {
      waitUntil: "networkidle0",
    });

    // Extract the text of elements matching the CSS selector
    const elements = await page.$$("tr td p a");

    // Print the text of each found element
    for (const element of elements) {
      const href = await page.evaluate(
        (el) => el.getAttribute("href"),
        element
      );
      const content = await page.evaluate(
        (el) => el.textContent.trim(),
        element
      );
      if (href.includes("index.php") || href.includes("File")) {
        continue;
      }
      charobjs.push({
        link: `https://en.touhouwiki.net${href}`,
        title: content,
      });
    }
  } catch (error) {
    console.error("Error scraping the page:", error);
  } finally {
    for (const char of charobjs) {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      );
      try {
        // Rotate IP addresses by using a proxy service (not implemented in this example)
        // Add a delay between requests to mimic human behavior
        // Wait for 5 seconds between requests
        await page.goto(char.link, { waitUntil: "networkidle0" });

        let Title;
        try {
          Title = await page.$eval(
            "#mw-content-text > div.mw-parser-output > table.infobox.vcard.outcell > tbody > tr:nth-child(2) > td > span > span",
            (element) => element.textContent.trim()
          );
        } catch (error) {}
        const Ability = await page.$eval(
          "#mw-content-text > div.mw-parser-output > table.infobox.vcard.outcell > tbody > tr:nth-child(4) > td",
          (element) => {
            const firstChild = element.firstElementChild;
            return firstChild ? firstChild.textContent.trim() : null;
          }
        );
        const Img = await page.evaluate(() => {
          const imgElement = document.querySelector(
            "#mw-content-text > div.mw-parser-output > table.infobox.vcard.outcell > tbody > tr:nth-child(2) > td > a > img"
          );
          return imgElement ? imgElement.getAttribute("src") : null;
        });
        characters.push({ name: char.title, text: Title || Ability, img: Img });
      } catch (error) {
        console.error("Error scraping character details:", error);
      } finally {
        await page.close();
      }
    }
    await browser.close();

    try {
      characters.forEach((element) => {
        if (element.img == null) {
          return; //might as well leave it null
        }
        element.img = `https://en.touhouwiki.net${element.img}`;
      });
      fs.writeFileSync("Dataprocessed.json", JSON.stringify(characters));

      // file written successfully
    } catch (err) {
      console.error(err);
    }
  }
})();
