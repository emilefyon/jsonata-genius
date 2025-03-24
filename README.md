# JSONata Genius

A powerful web application for transforming and querying JSON data using JSONata expressions, with AI-powered assistance.

![JSONata Genius App](https://cdn.e1000.me/jsonata-genius.png)

## Overview

JSONata Genius is an intuitive tool that helps you work with JSON data using [JSONata](https://jsonata.org/) expressions. It combines a clean interface with AI-powered generation of JSONata expressions, making it easy to extract, transform, and analyze your JSON data without having to be a JSONata expert.

## Live Demo

Try it now: [https://jsonata-genius.up.railway.app/](https://jsonata-genius.up.railway.app/)

## Features

- **Interactive JSON Editor**: Edit and validate your JSON data in real-time
- **AI-Powered Expression Generation**: Describe what you want to achieve in plain English, and let AI generate the JSONata expression for you
- **Live Expression Evaluation**: See results as you type or modify expressions
- **File Operations**: Upload JSON files and download transformed results
- **Resizable Interface**: Customize your workspace with resizable panels
- **Dark Mode**: Easy on the eyes with a modern dark theme interface

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn package manager
- An OpenAI API key (for AI-powered expression generation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/emilefyon/jsonata-genius.git
   cd jsonata-genius
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Using JSONata Genius

1. **Input JSON Data**:
   - Paste your JSON in the left panel, or
   - Click the upload icon to import a JSON file

2. **Create JSONata Expressions**:
   - Write expressions manually in the middle panel, or
   - Enter a description of what you want to extract/transform and click "Generate" to use AI

3. **View and Use Results**:
   - See the results in the bottom panel in real-time
   - Download the results as a JSON file using the download button

## JSONata Basics

JSONata is a lightweight query and transformation language for JSON data. Here are some basic examples:

- `$` - Returns the entire JSON document
- `Account."Account Name"` - Access nested properties
- `Account.Order.Product[0]` - Access array elements
- `Account.Order.Product.Price` - Returns an array of all prices
- `sum(Account.Order.Product.Price)` - Calculate the sum of all prices

[Learn more in the JSONata documentation](https://docs.jsonata.org/)

## AI-Powered Expressions

To use the AI feature for generating expressions:

1. Enter your OpenAI API key when prompted (stored only in your browser's localStorage)
2. Type a plain English description of what you want to extract or transform
3. Click "Generate" to create a JSONata expression based on your description
4. The expression will be automatically executed and results displayed

Example: "Give me the total price of all products" might generate `sum(Account.Order.Product.(Price * Quantity))`

## Privacy

- Your JSON data never leaves your browser except when using the AI feature
- OpenAI API keys are stored only in your browser's localStorage
- You can clear your API key at any time using the "Clear API key" link

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [JSONata](https://jsonata.org/) for the powerful JSON query and transformation language
- [React](https://reactjs.org/) for the UI framework
- [OpenAI](https://openai.com/) for the AI expression generation capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
