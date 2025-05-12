module.exports = {
  apps: [
    {
      name: "lead_data_collection",
      script: "./src/index.js",
      cwd: "/home/deploy/lead_data_collection/server",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 8082,
        SERVER_BASE_URL: "http://upload.jewelex.biz",
        KAPTURE_AUTH_TOKEN:
          "d2JmbThhb2QzNG1iZG4yc2NqdGFqN3Y0bGs0MWUxejR6dDN5am11anJ6NHVyaGV2Nzc=",
      },
      error_file: "/home/deploy/lead_data_collection/logs/app-err.log",
      out_file: "/home/deploy/lead_data_collection/logs/app-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
