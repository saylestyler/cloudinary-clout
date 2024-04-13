#!/usr/bin/env node

const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const chokidar = require('chokidar')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

/**
 * QA:
 * 
 * watch mode:
 * 
 * √ ./cloudinary_upload --watch
 * √ ./cloudinary_upload --watch --dir /Users/tyler/test-dir
 * √ ./cloudinary_upload --watch --dir /Users/tyler/test-dir --delete
 * √ ./cloudinary_upload --watch --dir /Users/tyler/test-dir --delete --copy
 * √ ./cloudinary_upload --dir /Users/tyler/test-dir --delete --copy
 * 
 * non-watch mode:
 * 
 * √ ./cloudinary_upload --file /Users/tyler/test-dir/test.png
 * √ ./cloudinary_upload /Users/tyler/test-dir
 * √ ./cloudinary_upload /Users/tyler/test-dir/test.png
 * √ ./cloudinary_upload /Users/tyler/test-dir --delete
 * √ ./cloudinary_upload /Users/tyler/test-dir --delete --copy
 * 
 */


/** hideBin is equivalent to process.argv.slice(2) */
const argv = yargs(hideBin(process.argv))
 .option('', {
    alias: '',
    type: null,
    description: 'No args passed with path; will attempt to upload either file or dir'
  })
  .option('watch', {
    alias: 'w',
    type: 'boolean',
    description: 'Watch for file changes'
  })
  .option('dir', {
    alias: 'dir',
    type: 'string',
    description: 'Directory to process'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'File to process'
  })
  .option('delete', {
    alias: 'del',
    type: 'boolean',
    description: 'File to process',
  })
  .option('copy', {
    alias: 'c',
    type: 'boolean',
    description: 'copy markdown img with cloudinary url to clipboard'
  })
  .option('ignored', {
    alias: 'i',
    type: 'string',
    description: 'Pattern of files to be ignored',
    default: /(^|[/\\])\../ 
  })
  .option('persistent', {
    alias: 'p',
    type: 'boolean',
    description: 'Keep running',
    default: true 
  })
  .option('usePolling', {
    alias: 'u',
    type: 'boolean',
    description: 'Use polling for changes',
    default: true
  })
  .option('binaryInterval', {
    alias: 'b',
    type: 'number',
    description: 'Polling interval',
    default: 5000 
  })
  .option('ignoreInitial', {
    alias: 'ii',
    type: 'boolean',
    description: 'Only new files added in watch mode will be uploaded; prevents reuploading',
    default: true
  })
  .option('stabilityThreshold', {
    alias: 'st',
    type: 'number',
    description: 'Time for a file size to remain constant before emitting its event',
    default: 2000 
  })
  .option('pollInterval', {
    alias: 'pi',
    type: 'number',
    description: 'File size polling interval',
    default: 100 
  })
  .argv


const WATCH_CONFIG = {
  ignored: argv.ignored,
  persistent: argv.persistent,
  usePolling: argv.usePolling,
  binaryInterval: argv.binaryInterval,
  ignoreInitial: argv.ignoreInitial,
  awaitWriteFinish: {
    stabilityThreshold: argv.stabilityThreshold,
    pollInterval: argv.pollInterval
  }
}

const WATCH_DIRECTORY = argv.dir || process.env.WATCH_DIRECTORY || `${process.env.HOME}/Screenshots/`

const uploadToCloudinary = async (filePath) => {
  try {
    const response = await cloudinary
      .uploader.upload(filePath, { folder: 'cli-upload' });
    console.log(`uploaded ${filePath} to cloudinary: ${response.secure_url}`);
    return response;
  } catch (error) {
    console.error(`error uploading ${filePath} to cloudinary:', ${error}`);
    throw error;
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
    console.log(`deleting uploaded img ${filePath}`);
  } catch (error) {
    console.error(`failed to delete already uploaded img ${error}`);
    throw error;
  }
};

const renameAndMoveFile = async (filePath, newPath) => {
  try {
    await fs.promises.rename(filePath, newPath);
    console.log(`successfully renamed the file to ${newPath}`);
  } catch (error) {
    console.error(`failed to move and rename the file: ${error}`);
    throw error;
  }
};

const processPath = (defaultPath) => {
   fs.stat(defaultPath, (err, stats) => {
    if (err) {
      console.error(`Error getting stats for path: ${err}`);
      return;
    }

    if (stats.isDirectory()) {
      fs.readdir(defaultPath, (err, files) => {
        if (err) {
          console.error(`Reading directory error: ${err}`);
          return;
        }

        files.forEach(file => {
          processFile(path.join(defaultPath, file));
        });
      });
    } else if (stats.isFile()) {
      processFile(defaultPath);
    } else {
      console.error('Please provide a file or directory to begin uploading');
    }
  });
}

const getRenamePath = (filePath, watchDir) => {
  const dateStr = new Date().toLocaleString().replace(/[,/:]/g, '-');
  const fileFullPath = path.basename(filePath);
  const ext = path.extname(filePath);
  const backupNewFileName = `upload-successful-${fileFullPath}-${dateStr}.${ext}`;
  const newPath = path.join(watchDir, backupNewFileName);
  return newPath
}

const processFile = async (filePath) => {
  if (path.basename(filePath).includes('upload-successful')) { return }

  try {
    const res = await uploadToCloudinary(filePath);

    if (argv.copy) {
      const markdownImg = `![alt text](${res.secure_url})`;
      console.log('copying markdown img to clipboard')
      execSync(`echo "${markdownImg}" | pbcopy`);
    }

    if (argv.delete) {
      console.log(`deleting file ${filePath}`)
      await deleteFile(filePath);
      return
    }

    await renameAndMoveFile(filePath, getRenamePath(filePath, WATCH_DIRECTORY));
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

if (argv.watch) {
  chokidar
    .watch(WATCH_DIRECTORY, WATCH_CONFIG)
    .on('add', filePath => setTimeout(() => processFile(filePath), 2000)) 
    .on('error', error => console.error(`watcher error: ${error}`));
} else if (argv.file) {
  processFile(argv.file);
} else if (argv._.length === 1) {
  processPath(argv._[0]);
} else {
  console.error('please provide a file or directory to process');
}