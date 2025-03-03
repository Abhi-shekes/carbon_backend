import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.NEWS_API_KEY;  // Ensure this is set properly in your environment

export const fetchEnvironmentalNews = async (req, res) => {
  const { from, sortBy, pageSize = 5 } = req.body;

  // Modify the query to search for articles related to carbon footprint, pollution, and environment
  const query = 'carbon footprint OR pollution OR environment';

  // Define the query parameters for the news API request
  const url = `https://newsapi.org/v2/everything?q=${query}&from=${from || '2025-02-01'}&sortBy=${sortBy || 'publishedAt'}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    // Make the API call to fetch news articles
    const response = await axios.get(url);

    // Extract important fields from the news response
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));

    // Send the trimmed response back to the client
    res.json({
      status: 'success',
      totalResults: response.data.totalResults,
      articles
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
