import * as fs from "fs";

export const getProjectId = () => {
  try {
    const config = JSON.parse(fs.readFileSync("./.dogcli", "utf8"));
    if (config.projectId === undefined) {
      throw Error("AppId not selected");
    }
    return config.projectId;
  } catch (e) {
    console.log(`
This directory doesn't seem to be initialized for deployment. 

Either run this command again from the root of your project or initialize this project with the following command:

dog apps:init
`);
    process.exit(1);
  }
};
