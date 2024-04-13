# future features fam

- [ ] support outbound url transformation api `https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>` optimizing / restricting image format / size before upload
- [ ] similarly, add support for transformations of the url copied to the clipboard, e.g. `f_auto,q_auto,rounded,blur` interpolated into url
- [ ] auto-restart if watch exits
- [ ] a secondary place the file(s) should also be stored (they can do this with google drive but requires premium acct.)
  - should read this first https://cloudinary.com/documentation/backups_and_version_management#enabling_automatic_backup
  - can use your own backup bucket or google cloud storage if !premium
  - `backup: true` added to url will ensure backup regardless of settings
- [ ] ai cropping
- [ ] ai alt text / general image tagging
  - apparently this can be done with simple auto_tagging=true (ig if u have the add on)
  - ig support all of the upload api flags:
    -https://cloudinary.com/documentation/upload_images
    - https://cloudinary.com/documentation/upload_parameters
  ```
       public_id: "wiki_shirt",
       quality_analysis: true,
       colors: true,
       categorization: "google_tagging",
       auto_tagging: true
  ```
- [ ] support video and video chunksize for streaming uploads (necessary past 20MB)
  - update copy option to interpolate into <video> element
