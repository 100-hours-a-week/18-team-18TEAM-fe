// release.config.cjs
module.exports = {
  branches: [
    { name: "main" },                   
    { name: "develop", prerelease: "dev", channel: "dev" }
  ],

  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    ["@semantic-release/npm", { npmPublish: false }],
    [
      "@semantic-release/github",
      {
        prerelease: process.env.GITHUB_REF_NAME === "develop",
      },
    ],
    ...(process.env.GITHUB_REF_NAME === "main"
      ? [
          [
            "@semantic-release/git",
            {
              assets: ["package.json", "CHANGELOG.md"],
              message:
                "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
          ],
        ]
      : []),
  ],
}