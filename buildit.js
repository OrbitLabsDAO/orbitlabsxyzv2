/*
  todo: 
  
  compress file bug
  update sonic js so it has a deploy hook 

*/
const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const matter = require("gray-matter");

// Get the delete and compress flags from command line arguments
const args = process.argv.slice(2);
const deleteDestFolder = args.includes("delete");
const compressAssets = args.includes("compress");
const environment = args.includes("prod") ? "production" : "local";

// Load environment variables
// Check if _data/env.js exists and set env object
let getEnvConfig;
let env = {};
if (fs.existsSync("./_data/env.js")) {
  getEnvConfig = require("./_data/env.js");
  env = getEnvConfig(environment);
}

// Load API data
let getapiData;
let apiData = [];
if (fs.existsSync("./_data/api.js")) {
  (async () => {
    try {
      getapiData = require("./_data/api.js");
      apiData = await getapiData(env); // Call getapiData asynchronously
      apiData = apiData.apiData; // Unwrap the JSON data
      processTemplates(); // Proceed with template processing
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  })();
} else {
  processTemplates(); // Proceed with template processing
}

/**
 * Processes the templates from the source directory and generates the output.
 */
function processTemplates() {
  //debug
  //console.log("Processing templates with API data:", apiData);
  const sourceFolder = "./_source";
  const includesFolder = "./_includes";
  const destBaseFolder = "./_site";
  const assetsFolder = "./_source/assets";

  // Setup Nunjucks environment
  nunjucks.configure([sourceFolder, includesFolder], {
    autoescape: false,
    noCache: true,
  });

  /**
   * Deletes the specified folder and its contents recursively.
   * @param {string} folderPath - The path of the folder to delete.
   */
  function deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const currentPath = path.join(folderPath, file);
        if (fs.lstatSync(currentPath).isDirectory()) {
          deleteFolder(currentPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }

  if (deleteDestFolder) {
    deleteFolder(destBaseFolder);
  }

  if (!fs.existsSync(destBaseFolder)) {
    fs.mkdirSync(destBaseFolder, { recursive: true });
  }

  /**
   * Copies the contents of one directory to another.
   * @param {string} src - The source directory.
   * @param {string} dest - The destination directory.
   */
  function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((item) => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  if (fs.existsSync(assetsFolder)) {
    const destAssetsFolder = path.join(destBaseFolder, "assets");
    copyDirectory(assetsFolder, destAssetsFolder);
    console.log(`✅ Successfully copied assets folder to ${destAssetsFolder}`);
  }

  /**
   * Generates content pages based on the provided data and templates.
   * @param {Array} dataArray - The data array to paginate.
   * @param {number} size - The number of items per page.
   * @param {string} alias - The alias for data items in the template.
   * @param {string} permalinkTemplate - The permalink template.
   * @param {string} layout - The layout template.
   * @param {Object} env - The environment variables.
   * @param {Array} outputFolders - The output folders.
   * @param {boolean} isIndexFile - Flag indicating if it's an index file.
   */
  async function generateContent(
    dataArray,
    size,
    alias,
    permalinkTemplate,
    layout,
    env,
    outputFolders,
    isIndexFile
  ) {
    if (dataArray && dataArray.length > 0) {
      const totalPages = Math.ceil(dataArray.length / size);
      for (let i = 0; i < totalPages; i++) {
        const pageData = dataArray.slice(i * size, (i + 1) * size);

        for (const pageItem of pageData) {
          const permalink = nunjucks.renderString(permalinkTemplate, {
            [alias]: pageItem,
          });

          const pageContent = nunjucks.renderString(layout, {
            ...env,
            content: pageItem,
            apiData,
          });

          for (const outputFolder of outputFolders) {
            const outputPath = path.join(
              destBaseFolder,
              outputFolder,
              permalink,
              "index.html"
            );

            const outputDir = path.dirname(outputPath);

            // Check if the file already exists before creating it
            if (!fs.existsSync(outputPath)) {
              await fs.promises.mkdir(outputDir, { recursive: true });
              await fs.promises.writeFile(outputPath, pageContent, "utf8");
              console.log(`✅ Created ${outputPath}`);
            } else {
              console.log(`❌ Skipped ${outputPath} (File already exists)`);
            }
          }
        }
      }
    } else {
      for (const outputFolder of outputFolders) {
        let outputPath;

        if (isIndexFile) {
          // Homepage index
          outputPath = path.join(destBaseFolder, "index.html");
        } else {
          const renderedPermalink = nunjucks
            .renderString(permalinkTemplate, env)
            .trim();

          // Render njk files to the  _site/ folder for example work.njk as _site / work / index.html
          if (
            !renderedPermalink ||
            renderedPermalink === "/" ||
            renderedPermalink === "index"
          ) {
            outputPath = path.join(destBaseFolder, outputFolder, "index.html");
          } else {
            outputPath = path.join(
              destBaseFolder,
              outputFolder,
              renderedPermalink,
              "index.html"
            );
          }
        }

        const outputDir = path.dirname(outputPath);
        const pageContent = nunjucks.renderString(layout, {
          ...env,
          content: {},
          apiData,
        });

        // Check if the file already exists before creating it
        if (!fs.existsSync(outputPath)) {
          await fs.promises.mkdir(outputDir, { recursive: true });
          await fs.promises.writeFile(outputPath, pageContent, "utf8");
          console.log(`✅ Created ${outputPath}`);
        } else {
          console.log(`❌ Skipped ${outputPath} (File already exists)`);
        }
      }
    }
  }

  fs.readdir(sourceFolder, async (err, files) => {
    if (err) {
      console.error("Error reading the source folder:", err);
      return;
    }

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      if (path.extname(file) === ".njk") {
        try {
          const data = await fs.promises.readFile(sourceFilePath, "utf8");

          // Parse the front matter
          const parsed = matter(data);
          const content = parsed.content;
          const frontMatter = parsed.data;

          let finalContent;

          if (frontMatter.layout) {
            // Ensure layout file has .njk extension
            if (!frontMatter.layout.includes(".njk")) {
              frontMatter.layout = frontMatter.layout + ".njk";
            }
            const layoutFilePath = path.join(
              includesFolder,
              frontMatter.layout
            );
            const layoutData = await fs.promises.readFile(
              layoutFilePath,
              "utf8"
            );

            // Render the layout with the page content
            finalContent = nunjucks.renderString(layoutData, {
              ...env,
              content: content,
              apiData, // Pass API data to layout
            });
          } else {
            // Render content without layout
            finalContent = nunjucks.renderString(content, {
              ...env,
              apiData, // Pass API data to template
            });
          }

          // Check for pagination
          if (frontMatter.pagination) {
            const paginationData = eval(frontMatter.pagination.data); // Consider safer alternatives if possible
            const size = frontMatter.pagination.size || 1;
            const alias = frontMatter.pagination.alias || "contentarray";
            const permalinkTemplate = frontMatter.permalink || "/";
            const outputFolders = frontMatter.outputFolder
              ? frontMatter.outputFolder
                  .split(",")
                  .map((folder) => folder.trim())
              : [path.basename(file, ".njk")];

            await generateContent(
              paginationData,
              size,
              alias,
              permalinkTemplate,
              finalContent,
              env,
              outputFolders,
              file === "index.njk"
            );
          } else {
            const outputFolders = frontMatter.outputFolder
              ? frontMatter.outputFolder
                  .split(",")
                  .map((folder) => folder.trim())
              : [path.basename(file, ".njk")];

            await generateContent(
              [],
              1, // Single page
              "content",
              frontMatter.permalink || "/",
              finalContent,
              env,
              outputFolders,
              file === "index.njk"
            );
          }
        } catch (err) {
          console.error("Error processing the Nunjucks file:", err);
        }
      }
    }

    if (compressAssets) {
      const compress = require("compression-library"); // Replace with your compression tool
      compress(assetsFolder);
      console.log("✅ Assets compressed successfully");
    }
  });
}
