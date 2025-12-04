package com.sajuai.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();

        // Railway provides DATABASE_URL in format: postgresql://user:pass@host:port/db
        // JDBC needs: jdbc:postgresql://host:port/db
        if (url != null && url.startsWith("postgresql://") && !url.startsWith("jdbc:")) {
            // Extract user and password from URL if present
            String jdbcUrl = "jdbc:" + url;

            // Parse the URL to extract username and password
            if (url.contains("@")) {
                String[] parts = url.split("@");
                String credentials = parts[0].substring("postgresql://".length());
                String hostAndDb = parts[1];

                if (credentials.contains(":")) {
                    String[] credParts = credentials.split(":", 2);
                    properties.setUsername(credParts[0]);
                    properties.setPassword(credParts[1]);
                }

                jdbcUrl = "jdbc:postgresql://" + hostAndDb;
            }

            properties.setUrl(jdbcUrl);
        }

        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }
}
