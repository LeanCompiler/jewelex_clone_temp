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
        URLS_DB_PATH: "/home/deploy/lead_data_collection/data/db/urls.db",
        API_KEY:
          "9c6c341ab8caa202078bf1efbf3a443951eb9730f1697e584d17d6f7a94b26699e3a76c7d26e764a2e3c6d06e22863ce552d71f497ff6991dbbb4ef6a8d46330",
        FILE_SIZE_LIMIT_MB: 10,
        MAX_FILES_LIMIT: 5,
        UPLOADS_WRITE_DIR: "/home/deploy/lead_data_collection/data/uploads",
        SERVER_BASE_URL: "https://i.jewelex.biz",
        KAPTURE_URL:
          "https://jewelex.kapturecrm.com/add-ticket-from-other-source.html/v.2.0",
        KAPTURE_AUTH_TOKEN:
          "d2JmbThhb2QzNG1iZG4yc2NqdGFqN3Y0bGs0MWUxejR6dDN5am11anJ6NHVyaGV2Nzc=",
        INTERAKT_URL: "https://api.interakt.ai/v1/public/message/",
        INTERAKT_AUTH_TOKEN:
          "TTNsNlFUWnZlZm1sNzFBeWZ3cGxJSWhaTU9KWktHX0VZSzZZMjMzdWlwbzo=",
      },
      error_file: "/home/deploy/lead_data_collection/logs/app-err.log",
      out_file: "/home/deploy/lead_data_collection/logs/app-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
