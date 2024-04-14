Cloutinary

## Install

```
npm install --g cloutinary 
```

or 

```
npx cloutinary
```

## usage 


## upload a single file

```
cloutinary img.png
```

# upload all images in a dir

```
cloutinary my-dir
```

(There are the flags `--file` and `--dir` but autodetection of those built in.)

# watch mode

This is what I wrote this code for initially. I wanted anything that was screenshotted (shooted?) to be uploaded to my media library. In general nowadays when I'm writing posts and need images on [my blog](https://www.tylersayles.com) I'll start it up. You can specify a watch `--dir` as well and [bind a custom key](/zsh-custom-command-example) so only certain screenshots are uploaded.

```
cloutinary --watch
```

## background watcher

create a tmux session that is running `cloutinary --watch` if you love to close entire triple tabbed terminal session(s) on the daily and are too lazy to figure out how to restore them heh:

```sh
(tmux &&) cd ~/repo && cloutinary && ctrl-b d
```

# upload processing flags

For any of the above 3 commands, you can add `--copy` to save the url to your clipboard and/or `--delete`. The default behavior once a file(s) has been uploaded to rename the image in place. This is used in part if your paranoid, but also to avoid re-uploding a buncha files you already did. For example:

```
cloutinary --watch --dir /my-dear --copy --delete
```

This would watch the directory `/my-dir`, upload anything that is moved / appears there, copy the url to clipboard and delete the files once upload is successful.

# watch configuration

Cloutinary uses chokidar to watch files. There are some configuration values you may change if you so please. They are: 

TODO