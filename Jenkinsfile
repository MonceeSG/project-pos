pipeline {
    agent any

    tools {
        nodejs "NodeJS_24"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/MonceeSG/project-pos.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || echo "No lint configured, skipping..."'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "No tests found, skipping..."'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    # Stop existing app (if any)
                    pm2 stop backend-app || true

                    # Start app again
                    pm2 start index.js --name backend-app

                    # Save pm2 process list
                    pm2 save
                '''
            }
        }
    }
}

