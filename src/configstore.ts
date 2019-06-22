import * as fs from "fs";

const checkIfRoot = () => {
  if (!fs.existsSync("./package.json")) {
    console.log(`
This command must be run from the root of your project. We didn't find a "package.json" file in this directory, so we're assuming it's not root and exiting"        
`);
    process.exit();
  }
};

export const configstore = {
  get: (key: string) => {
    checkIfRoot();
    try {
      const config = JSON.parse(fs.readFileSync("./.dogcli", "utf8"));
      return config[key];
    } catch (e) {
      // ignore
    }
  },
  set: (key: string, value: any) => {
    checkIfRoot();
    try {
      if (fs.existsSync("./.dogcli")) {
        const config = JSON.parse(fs.readFileSync("./.dogcli", "utf8"));
        fs.writeFileSync(
          "./.dogcli",
          JSON.stringify({ ...config, [key]: value })
        );
      } else {
        fs.writeFileSync("./.dogcli", JSON.stringify({ [key]: value }));
      }
    } catch (e) {
      // ignore
    }
  },
  clear: () => {
    checkIfRoot();
    fs.writeFileSync("./.dogcli", "{}");
  },
  delete: (key: string) => {
    checkIfRoot();
    try {
      if (fs.existsSync("./.dogcli")) {
        const config = JSON.parse(fs.readFileSync("./.dogcli", "utf8"));
        const { [key]: removeMe, ...keepThese } = config;
        fs.writeFileSync("./.dogcli", JSON.stringify(keepThese));
      }
    } catch (e) {
      // ignore
    }
  }
};
