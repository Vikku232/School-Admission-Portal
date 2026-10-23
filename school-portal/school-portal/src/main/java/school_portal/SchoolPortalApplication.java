package school_portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class SchoolPortalApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(SchoolPortalApplication.class, args);
	}

	/**
	 * Loads key-value pairs from .env file into Java System Properties,
	 * allowing application.properties to seamlessly resolve ${VARIABLE_NAME}
	 * without committing private secrets to GitHub.
	 */
	public static void loadDotEnv() {
		List<String> candidatePaths = Arrays.asList(
				".env",
				"school-portal/.env",
				"school-portal/school-portal/.env",
				"../.env",
				"../../.env"
		);

		for (String path : candidatePaths) {
			File envFile = new File(path);
			if (envFile.exists() && envFile.isFile()) {
				System.out.println(">> [DotEnv] Loading environment properties from: " + envFile.getAbsolutePath());
				try (BufferedReader reader = new BufferedReader(new FileReader(envFile, StandardCharsets.UTF_8))) {
					String line;
					while ((line = reader.readLine()) != null) {
						line = line.trim();
						if (line.isEmpty() || line.startsWith("#")) {
							continue;
						}
						int eqIndex = line.indexOf('=');
						if (eqIndex > 0) {
							String key = line.substring(0, eqIndex).trim();
							String value = line.substring(eqIndex + 1).trim();
							if ((value.startsWith("\"") && value.endsWith("\"")) ||
								(value.startsWith("'") && value.endsWith("'"))) {
								value = value.substring(1, value.length() - 1);
							}
							if (!key.isEmpty() && System.getProperty(key) == null) {
								System.setProperty(key, value);
							}
						}
					}
				} catch (Exception e) {
					System.err.println("Warning: Could not read .env file at " + path + ": " + e.getMessage());
				}
				break;
			}
		}
	}
}
