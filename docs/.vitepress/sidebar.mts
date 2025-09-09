import blog from './sidebar/blog.mts';
import daily from './sidebar/daily.mts';
import os from './sidebar/os.mts';
import coding from './sidebar/coding.mts';
import devops from './sidebar/devops.mts';
import network from './sidebar/network.mts';

export default {
  '/daily/': daily,
  '/os/': os,
  ...blog,
  ...coding,
  '/devops/': devops,
  '/network/': network,
};
