# 📦 SciFind
This project is a full web system for searching and recommending scientific articles, leveraging **Docker** to simplify deployment.

## 🚀 Requirements
- Have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

## 🛠️ Installation and Execution
Follow these steps to run the project locally:

1. **Install Docker Desktop**  
   - Download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).
   - Run the installer and follow the setup wizard, selecting WSL 2 as the backend (for Windows).
   - Open Docker Desktop and wait for it to initialize.
   - Verify the installation by running the following command in your system console (cmd) or PowerShell:
        ```bash
        docker --version
        ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/PedroLanderos/ProyectoIng
   ```

3. **Navigate to the project directory**
   ```bash
   cd ProyectoIng
   ```

4. **Build and run the containers**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   Once the containers are running, you can access the system at:
   ```
   http://localhost:3000/
   ```

## 🧹 Shutting Down the Containers
When you are done using the system, you can stop all containers by pressing `Ctrl + C` in the terminal where they are running, and then:
```bash
docker-compose down
```
After the containers have been loaded, you can also start and stop them from the Docker Desktop application.
