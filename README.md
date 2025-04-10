# Multi-Agent System with MLflow Integration

This project is a Django-based multi-agent system that integrates MLflow for experiment tracking and trace management. It provides a web interface for interacting with AI agents and tracking their performance.

## Project Architecture

The project follows a modular architecture with the following components:

1. **Django Web Application**
   - Core application handling web interface and user interactions
   - ASGI-based server using Daphne for WebSocket support
   - Template-based frontend with JavaScript for dynamic interactions

2. **MLflow Integration**
   - Experiment tracking and model management
   - Trace logging and visualization
   - Artifact storage and management

3. **Multi-Agent System**
   - Modular agent architecture
   - WebSocket-based communication
   - Redis-backed channel layer for real-time communication

## Directory Structure

```
.
├── core/                 # Django core application
│   ├── static/          # Static files (JS, CSS)
│   ├── templates/       # HTML templates
│   └── ...
├── multi_agent/         # Multi-agent system implementation
├── all_agents/          # Individual agent implementations
├── mlartifacts/         # MLflow artifacts storage
├── mlruns/              # MLflow experiment runs
├── requirements.txt     # Project dependencies
└── manage.py           # Django management script
```

## Prerequisites

- Python 3.8 or higher
- Redis server
- Virtual environment (recommended)

## Installation

1. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add necessary environment variables (e.g., OPENAI_API_KEY)

## Running the Application

1. Start the MLflow server for Traces:

```bash
mlflow server --host 127.0.0.1 --port 8080
```

2. In a separate terminal, start the Django server using Daphne:

```bash
daphne -p 8000 multi_agent.asgi:application
```

3. Access the application:
   - Web interface: http://localhost:8000
   - MLflow UI: http://localhost:8080

## Features

- Web-based interface for interacting with AI agents
- Experiment tracking and visualization with MLflow
- API key management with secure cookie storage
- Trace logging and analysis

## Development

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Running Tests

```bash
python manage.py test
```

## Security Considerations

- API keys are stored in secure HTTP-only cookies
- CSRF protection enabled
- Environment variables for sensitive configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

Copyright (c) 2025 RAVISANE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For support, please email on rsane@appypiellp.com