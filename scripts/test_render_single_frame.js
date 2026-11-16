// scripts/test_render_single_frame.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Run render_cinematic_3d_story_reel.js up to writing tmp_cinematic_3d.html
require('./render_cinematic_3d_story_reel.js');
