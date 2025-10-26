pipeline {
    agent any

    environment {
        NOTIFY_EMAIL = 'christianprawiragunawanz@gmail.com'
    }

    stages {
        stage('Build & Deploy Backend') {
            steps {
                build job: 'Backend_MiniPos', propagate: true
            }
        }

        stage('Build & Deploy Frontend') {
            steps {
                build job: 'Frontend_MiniPos', propagate: true
            }
        }

        stage('Post-Deployment Checks') {
            steps {
                sh 'curl -I http://localhost:3000 || echo "Backend not responding"'
                sh 'curl -I http://localhost:5173 || echo "Frontend not responding"'
            }
        }
    }

    post {
        success {
            echo 'Full Pipeline SUCCESS'
            // mail to: "${NOTIFY_EMAIL}", subject: "Pipeline Success", body: "Backend & Frontend deployed successfully"
        }
        failure {
            echo 'Full Pipeline FAILED'
            // mail to: "${NOTIFY_EMAIL}", subject: "Pipeline Failed", body: "Check Jenkins logs for details"
        }
        always {
            cleanWs()
        }
    }
}

