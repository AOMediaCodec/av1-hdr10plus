# AV1 and HDR10+ Conformance Report

## :warning: **WARNING** :warning:

Files in this folder are still under review by other members of the group.

## Installing LFS for the first time

If you don't have git LFS installed on your system you will need to install it in order to download the files when you clone the repository. If you are not sure if you have LFS on your system try running the `git lfs version` command. If you don't have it do the following:

1. Install Git LFS: Visit the Git LFS website (https://git-lfs.github.com/) and follow the installation instructions for your operating system.  
E.g.: On macOS you can run: `brew install git-lfs`

2. Once Git LFS is installed, you should set it up for use with your repositories. In your terminal, run: `git lfs install`  
This command sets up Git LFS hooks and filters for the repository.

3. Now you're ready to clone a repository: `git clone https://github.com/AOMediaCodec/av1-hdr10plus.git`

4. At this point, Git LFS should have downloaded all LFS files in the repository. You can confirm this by checking the size of the LFS files in your local repository. They should match the size of the files in the remote repository. In some cases, Git LFS files might not download automatically when you clone a repository. If this happens, you can manually download the LFS files with the `git lfs pull` command. Run this command in the root directory of your local repository to download all Git LFS files: `git lfs pull`

## TODO:

- add links to files
- finish automation
