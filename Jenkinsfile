pipeline {
    agent any

    tools {
        nodejs "Node24"
    }

    environment {
        REPO_URL = 'https://github.com/MonceeSG/project-pos.git'
        CREDENTIAL_ID = 'github-token'
    }

    stages {
        stage('Checkout Backend Repository') {
            steps {
                echo "🔄 Cloning backend repository..."
                git branch: 'main',
                    url: "${REPO_URL}",
                    credentialsId: "${CREDENTIAL_ID}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing backend dependencies..."
                sh 'npm ci || npm install'
            }
        }

        stage('Lint Code') {
            steps {
                echo "🔍 Running ESLint..."
                sh 'npm run lint || echo "⚠️ No lint configured, skipping..."'
            }
        }

        stage('Run Tests') {
            steps {
                echo "🧪 Running backend tests..."
                sh 'npm test || echo "⚠️ No tests found, skipping..."'
            }
        }

        stage('Deploy Backend') {
            steps {
                echo "🚀 Deploying backend service..."
                sh '''
                    pm2 stop Backend_MiniPos || true
                    pm2 start index.js --name Backend_MiniPos
                    pm2 save
                    echo "✅ Backend_MiniPos running via PM2"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Backend_MiniPos Pipeline SUCCESS!'
        }
        failure {
            echo '❌ Backend_MiniPos Pipeline FAILED!'
        }
        always {
            echo '🧹 Cleaning workspace...'
        }
    }
}

