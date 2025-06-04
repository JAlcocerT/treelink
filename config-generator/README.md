# TreeLink Config Generator

A Flask-based web application that generates configuration files for TreeLink, a free and open-source LinkTree alternative.

## Features

- User-friendly form to configure your TreeLink page
- Add multiple social media links with icons
- Add custom links with custom titles
- Upload a profile picture
- Generate a downloadable zip file with the configuration

## Prerequisites

- Python 3.8+
- pip (Python package installer)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```bash
   cd config-generator
   ```
3. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the Flask development server:
   ```bash
   python app.py
   ```
2. Open your web browser and navigate to `http://localhost:5000`

## Usage

1. Fill out the form with your information
2. Add social media links and custom links as needed
3. Upload a profile picture (optional)
4. Click "Generate Configuration" to download the configuration file
5. Use the generated `site-config.zip` with your TreeLink installation

## Deployment

For production deployment, consider using a production WSGI server like Gunicorn or uWSGI, and a reverse proxy like Nginx.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [TreeLink](https://github.com/trevortylerlee/treelink) - The original project this config generator is designed for
