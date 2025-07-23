import blog from './blog.mts';
import daily from './daily.mts';
import os from './os.mts';
import coding from './coding.mts';

export default {
  '/daily/': daily,
  '/os/': os,
  ...blog,
  ...coding,
};
