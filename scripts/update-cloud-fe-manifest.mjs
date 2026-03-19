#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const appStage = process.env.APP_STAGE
const cloudRepoDir = process.env.CLOUD_REPO_DIR
const imageUri = process.env.IMAGE_URI
const gitSha = process.env.GIT_SHA ?? 'unknown'
const deployedAt = process.env.DEPLOYED_AT ?? new Date().toISOString()
const deployedBy = process.env.DEPLOYED_BY ?? 'github-actions'

if (!appStage || !cloudRepoDir || !imageUri) {
  console.error('APP_STAGE, CLOUD_REPO_DIR, and IMAGE_URI are required.')
  process.exit(1)
}

const relativeTarget =
  appStage === 'prod'
    ? 'k8s/apps/fe/base/deployment.yaml'
    : 'k8s/apps/fe/overlays/dev/resources.yaml'

const targetPath = path.join(cloudRepoDir, relativeTarget)

if (!fs.existsSync(targetPath)) {
  console.error(`Target manifest not found: ${targetPath}`)
  process.exit(1)
}

let content = fs.readFileSync(targetPath, 'utf8')

content = content.replace(/(^\s*image:\s*).+$/m, `$1${imageUri}`)

content = content.replace(/(^\s*bizkit\.io\/git-sha:\s*).+$/gm, `$1${gitSha}`)

content = content.replace(
  /(^\s*bizkit\.io\/deployed-at:\s*).+$/gm,
  `$1${deployedAt}`
)

content = content.replace(
  /(^\s*bizkit\.io\/deployed-by:\s*).+$/gm,
  `$1${deployedBy}`
)

fs.writeFileSync(targetPath, content)
console.log(`Updated ${relativeTarget}`)
