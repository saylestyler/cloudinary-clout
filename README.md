# cloutinary 

> gimme a sec

## Install

```
$ npm install --global cloutinary 
```

## Usage

```
$ cloutinary --help

  Usage
    $ cloutinary [input]

  Options
    --postfix  Lorem ipsum  [Default: lorem]

  Examples
    $ cli-name
    laura ipsume
    $ cli-name ponies
    lauren ipsuma
```

## background watcher

create a tmux session that is running `./cloudinary_upload` if you love to close entire triple tabbed terminal session(s) on the quotidian and are too lazy to figure out how to restore them heh:

```sh
(tmux &&) cd ~/repo && node cloudinary_upload && ctrl-b d
```

## transformational arg example

here's a cl image url where you can see `ar_1.0,c_fill,h_250/bo_5px_solid_lightblue` following `/upload/`:

`https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue/leather_bag_gray.jpg`

where, ofc the original and unadulterated url was:

`https://res.cloudinary.com/demo/image/upload/leather_bag_gray.jpg`

these two strings, separated by a forward slash, are an example of delivering the same image, this time with transformation parameters applied, so that the image is scaled down, cropped to fill a 250px square, with an aspect ratio of 1:1 = 1.0, and then a light blue border is applied:

you can see a trillion more examples [here](https://cloudinary.com/documentation/transformation_reference) here's one of mine with a lot of options before & after, here the pink border was already around the image, anything beyond it is the result of the args above from my first job in nyc as an editor @ vfiles:

<img alt="design dump photo" src="https://res.cloudinary.com/cloudimgts/image/upload/v1694462366/cli-upload/u6p5wn7fpnerysk9bliq.png" />

and here's what the same img looks like with the arg string of `/c_fill,h_400,w_250/a_20/e_outline,co_brown/q_auto/f_auto/` added for which get this url & image:

`https://res.cloudinary.com/cloudimgts/image/upload//c_fill,h_400,w_250/a_20/e_outline,co_brown/q_auto/f_auto/v1694462366/cli-upload/u6p5wn7fpnerysk9bliq.png`

<img alt="design dump photo" src="https://res.cloudinary.com/cloudimgts/image/upload/c_fill,q_auto/a_500/e_outline,co_blue/q_auto/f_auto/v1694462366/cli-upload/u6p5wn7fpnerysk9bliq.png" />

Basically art.



