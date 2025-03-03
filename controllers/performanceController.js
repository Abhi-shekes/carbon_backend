// controllers/performanceController.js

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

export const analyzePerformance = async (req, res) => {
  const { url } = req.body;

  // Validate if URL is provided
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Launch headless Chrome
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port };

    // Run Lighthouse on the given URL
    const runnerResult = await lighthouse(url, options);

    // Close Chrome after the audit
    await chrome.kill();

    // Get the required details from the Lighthouse report
    const performanceScore = runnerResult.lhr.categories.performance.score * 100;

    // Extract important metrics
    const audits = runnerResult.lhr.audits;
    const firstContentfulPaint = audits['first-contentful-paint'].displayValue;
    const speedIndex = audits['speed-index'].displayValue;
    const largestContentfulPaint = audits['largest-contentful-paint'].displayValue;
    const timeToInteractive = audits['interactive'].displayValue;
    const totalBlockingTime = audits['total-blocking-time'].displayValue;
    const cumulativeLayoutShift = audits['cumulative-layout-shift'].displayValue;

    // Send back the essential details
    res.json({
      performanceScore,
      metrics: {
        firstContentfulPaint,
        speedIndex,
        largestContentfulPaint,
        timeToInteractive,
        totalBlockingTime,
        cumulativeLayoutShift
      }
    });
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    res.status(500).json({ error: 'Failed to analyze the website' });
  }
};
