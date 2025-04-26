
# JSONata Genius - Technical Documentation

## Overview

JSONata Genius is a web application that allows users to transform and query JSON data using JSONata expressions. It provides a user-friendly interface with real-time validation, expression evaluation, and AI-assisted expression generation capabilities.

## Core Functionalities

### 1. JSON Input & Validation

**Description:**  
Users can input JSON data either by pasting it directly into the editor or by uploading a JSON file. The application validates the JSON in real-time and provides error messages for invalid JSON.

**Implementation Details:**
- The JSON editor uses a simple textarea with custom styling
- JSON validation happens on change using `JSON.parse()`
- File upload functionality supports `.json` files only

**Component:** `src/components/JsonInput.tsx`

**API Calls:**
- No external API calls for this feature
- File handling uses the browser's FileReader API:
```javascript
const reader = new FileReader();
reader.onload = (event) => {
  const content = event.target?.result as string;
  // Validate and process JSON
};
reader.readAsText(file);
```

**UI Specifics:**
- The JSON editor has a dark theme with syntax highlighting
- Valid/invalid JSON status indicator in the header
- Error messages displayed at the bottom of the editor for invalid JSON
- Scrollable interface for handling large JSON documents
- Special attention to handle horizontal scrolling for wide JSON structures

### 2. JSONata Expression Editor

**Description:**  
Users can write, edit, and evaluate JSONata expressions against the provided JSON data. The expression editor supports standard JSONata syntax and displays results in real-time.

**Implementation Details:**
- Simple textarea for entering JSONata expressions
- Expression evaluation using the jsonata library
- Copy functionality for saving expressions
- Play button for manual evaluation

**Component:** `src/components/JsonataEditor.tsx`

**API Calls:**
- No external API calls for the core functionality
- JSONata evaluation happens client-side:
```javascript
import jsonata from "jsonata";

const expression = jsonata(expr);
const resultValue = await expression.evaluate(parsedJson);
```

**UI Specifics:**
- Green text for expressions to distinguish them from JSON input
- Error messages displayed at the bottom when expressions fail to evaluate
- Copy button to save expressions to clipboard
- Evaluate button with loading indicator during evaluation

### 3. AI-Powered Expression Generation

**Description:**  
Users can describe what they want to extract or transform from their JSON in plain English, and the application will generate a JSONata expression using OpenAI's API.

**Implementation Details:**
- Text input for natural language description of what the user wants to achieve
- Integration with OpenAI API for expression generation
- Automatic evaluation of generated expressions
- API key management through localStorage

**Component:** `src/components/JsonataEditor.tsx`

**API Calls:**
- **OpenAI API**
  - **Endpoint:** `https://api.openai.com/v1/chat/completions`
  - **Method:** POST
  - **Headers:**
    ```
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
    ```
  - **Payload:**
    ```json
    {
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "system",
          "content": "You are a JSONata expert. Given a JSON object and a description of what the user wants to extract or transform, provide only a valid JSONata expression that accomplishes this task. Do not include any explanations, do not format as a code block, just return the raw JSONata expression."
        },
        {
          "role": "user",
          "content": "JSON: {JSON_DATA}\n\nTask: {USER_PROMPT}\n\nProvide only a valid JSONata expression."
        }
      ],
      "temperature": 0.2
    }
    ```
  - **Response:** The API returns a JSONata expression that matches the described task

**UI Specifics:**
- User-friendly prompt input field
- Generate button with loading indicator
- Clear API key option for user privacy
- API key input form appears when no key is available in localStorage
- Security note explaining that the API key is stored only in the user's browser

### 4. Result Display

**Description:**  
The application displays the results of JSONata expression evaluation in a formatted, readable manner. Users can copy or download the results.

**Implementation Details:**
- JSON.stringify with formatting for object results
- Simple string display for primitive results
- Download functionality for saving results to a file
- Copy to clipboard functionality

**Component:** `src/components/JsonataResult.tsx`

**API Calls:**
- No external API calls
- File download uses the Blob API:
```javascript
const blob = new Blob([result], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `jsonata-result-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
a.click();
```

**UI Specifics:**
- Results displayed in a scrollable container
- Different text color for simple values vs. complex JSON
- Copy button with success feedback
- Download button for saving results
- Toast notifications for copy/download actions

### 5. Resizable Interface

**Description:**  
The application features a resizable interface that allows users to adjust the size of each panel to their preference, optimizing their workflow.

**Implementation Details:**
- Uses `react-resizable-panels` for the resizable interface
- Horizontal resizing between JSON input and expression/result panels
- Vertical resizing between expression editor and result panels

**Components:** 
- `src/pages/Index.tsx`
- `src/components/ui/resizable.tsx`

**API Calls:**
- No external API calls

**UI Specifics:**
- Drag handles with visual indicators
- Minimum size constraints to prevent panels becoming too small
- Smooth resizing animation
- Dark theme consistent across all panels

### 6. File Operations

**Description:**  
The application supports uploading JSON files for input and downloading JSONata results as JSON files.

**Implementation Details:**
- File input for JSON uploads
- Blob creation and URL.createObjectURL for downloads
- Automatic toast notification when upload results are ready for download

**API Calls:**
- No external API calls
- Uses browser File API for uploads
- Uses browser Blob API for downloads

**UI Specifics:**
- Upload button in the JSON editor header
- Download button in the result panel header
- Toast notification with download action after file upload
- File naming convention includes timestamp for downloaded files

## Application Architecture

### Project Structure

```
src/
├── components/
│   ├── JsonInput.tsx           # JSON input editor
│   ├── JsonataEditor.tsx       # JSONata expression editor
│   ├── JsonataResult.tsx       # Result display
│   ├── HowItWorksModal.tsx     # Modal with usage instructions
│   └── ui/                     # UI components
├── hooks/                      # React hooks
├── lib/                        # Utility functions
├── pages/
│   ├── Index.tsx               # Main application page
│   └── NotFound.tsx            # 404 page
└── main.tsx                    # Application entry point
```

### Key Components

1. **Index.tsx**: Main application container that orchestrates all components
2. **JsonInput.tsx**: Handles JSON input, validation, and file uploads
3. **JsonataEditor.tsx**: Manages JSONata expressions, AI generation, and evaluation
4. **JsonataResult.tsx**: Displays evaluation results and provides download options

### State Management

The application uses React's useState and useEffect hooks for state management:

- **JSON Input State**: Managed in Index.tsx and passed to child components
- **Expression State**: Managed in JsonataEditor.tsx
- **Result State**: Generated in JsonataEditor.tsx and passed to Index.tsx, then to JsonataResult.tsx

### External Dependencies

- **jsonata**: Core library for evaluating JSONata expressions
- **react-resizable-panels**: Used for the resizable interface
- **sonner**: Toast notifications
- **lucide-react**: UI icons

## Security Considerations

### API Key Management

- OpenAI API keys are stored in the user's browser localStorage
- Keys are never sent to any server except OpenAI's API
- Users can clear their API key at any time
- All API requests happen directly from the client to OpenAI

### Data Privacy

- JSON data is never sent to any server except during AI expression generation
- No analytics or tracking is implemented in the application
- No cookies are used for storing user data

## Browser Compatibility

The application is built with modern web standards and should work on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Large JSON documents may impact performance
- The UI is designed to be responsive with resizable panels
- JSONata evaluation happens asynchronously to prevent UI blocking
- AI generation has built-in error handling for network issues

## Deployment

The application is a standard React application that can be deployed to any static hosting service:

1. Build the application using `npm run build` or `yarn build`
2. Deploy the contents of the `dist` folder to your hosting service
3. No server-side components are required

## Future Development Considerations

- **Backend Proxy**: For production use, consider implementing a backend proxy for OpenAI API calls
- **Expression Library**: Add functionality to save and load commonly used expressions
- **Additional JSONata Features**: Support for JSONata extensions and custom functions
- **Multiple JSON Documents**: Support for working with multiple JSON documents simultaneously
