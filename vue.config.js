module.exports = {
  publicPath:
    process.env.VUE_APP_MODE === "pages"
      ? "/" + process.env.CI_PROJECT_NAME + "/"
      : "/"
};
