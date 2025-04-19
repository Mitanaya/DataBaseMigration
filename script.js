document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // Generate button functionality
    const generateBtn = document.getElementById('generateBtn');
    const resultsPanel = document.getElementById('resultsPanel');
    
    generateBtn.addEventListener('click', function() {
        const sourceDb = document.getElementById('sourceDb').value;
        const targetDb = document.getElementById('targetDb').value;
        
        if (!sourceDb || !targetDb) {
            alert('Please select both source and target databases');
            return;
        }
        
        // Show loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        // Simulate generation delay
        setTimeout(() => {
            generateMigrationPlan(sourceDb, targetDb);
            
            // Reset button
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Migration Plan';
            generateBtn.disabled = false;
            
            // Scroll to results
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });
    
    // Function to generate migration plan
    function generateMigrationPlan(sourceDb, targetDb) {
        const schemaOptions = Array.from(document.getElementById('schemaOptions').selectedOptions)
            .map(option => option.value);
        const dataOptions = Array.from(document.getElementById('dataOptions').selectedOptions)
            .map(option => option.value);
        const deploymentType = document.querySelector('input[name="deploymentType"]:checked').value;
        const migrationStrategy = document.getElementById('migrationStrategy').value;
        const specialRequirements = document.getElementById('specialRequirements').value;
        
        // Generate plan content
        const planTab = document.getElementById('planTab');
        planTab.innerHTML = `
            <h3>Migration Plan Summary</h3>
            <div class="plan-summary">
                <div class="summary-item">
                    <span class="summary-label">Source Database:</span>
                    <span class="summary-value">${getDbName(sourceDb)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Target Database:</span>
                    <span class="summary-value">${getDbName(targetDb)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Schema Components:</span>
                    <span class="summary-value">${schemaOptions.map(opt => capitalizeFirstLetter(opt)).join(', ') || 'None selected'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Data Migration:</span>
                    <span class="summary-value">${dataOptions.map(opt => capitalizeFirstLetter(opt)).join(', ') || 'None selected'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Deployment Type:</span>
                    <span class="summary-value">${getDeploymentTypeName(deploymentType)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Migration Strategy:</span>
                    <span class="summary-value">${getStrategyName(migrationStrategy)}</span>
                </div>
            </div>
            
            <h3>Recommended Steps</h3>
            <ol class="steps-list">
                ${generateMigrationSteps(sourceDb, targetDb, deploymentType)}
            </ol>
            
            <h3>Potential Challenges</h3>
            <ul class="challenges-list">
                ${generatePotentialChallenges(sourceDb, targetDb)}
            </ul>
            
            ${specialRequirements ? `
            <h3>Special Requirements</h3>
            <div class="special-requirements">
                <p>${specialRequirements}</p>
            </div>
            ` : ''}
        `;
        
        // Generate scripts content
        const scriptsTab = document.getElementById('scriptsTab');
        scriptsTab.innerHTML = `
            <h3>Generated Migration Scripts</h3>
            <div class="script-category">
                <h4>Schema Conversion</h4>
                <pre class="script-block">${generateSchemaScript(sourceDb, targetDb, schemaOptions)}</pre>
                <button class="copy-btn" data-clipboard-target=".script-block"><i class="fas fa-copy"></i> Copy Script</button>
            </div>
            
            ${dataOptions.includes('all') || dataOptions.includes('partial') || dataOptions.includes('sampled') ? `
            <div class="script-category">
                <h4>Data Migration</h4>
                <pre class="script-block">${generateDataScript(sourceDb, targetDb, dataOptions)}</pre>
                <button class="copy-btn" data-clipboard-target=".script-block"><i class="fas fa-copy"></i> Copy Script</button>
            </div>
            ` : ''}
            
            <div class="script-category">
                <h4>Validation</h4>
                <pre class="script-block">${generateValidationScript(sourceDb, targetDb)}</pre>
                <button class="copy-btn" data-clipboard-target=".script-block"><i class="fas fa-copy"></i> Copy Script</button>
            </div>
            
            ${document.getElementById('generateRollback').checked ? `
            <div class="script-category">
                <h4>Rollback</h4>
                <pre class="script-block">${generateRollbackScript(sourceDb, targetDb)}</pre>
                <button class="copy-btn" data-clipboard-target=".script-block"><i class="fas fa-copy"></i> Copy Script</button>
            </div>
            ` : ''}
        `;
        
        // Generate documentation content
        const docsTab = document.getElementById('docsTab');
        docsTab.innerHTML = `
            <h3>Migration Documentation</h3>
            <div class="doc-section">
                <h4>Pre-Migration Checklist</h4>
                <ul class="doc-list">
                    ${generatePreMigrationChecklist(sourceDb, targetDb)}
                </ul>
            </div>
            
            <div class="doc-section">
                <h4>Installation Guide for ${getDbName(targetDb)}</h4>
                <div class="installation-guide">
                    ${generateInstallationGuide(targetDb, deploymentType)}
                </div>
            </div>
            
            <div class="doc-section">
                <h4>Post-Migration Validation</h4>
                <ul class="doc-list">
                    ${generatePostMigrationValidation(sourceDb, targetDb)}
                </ul>
            </div>
            
            <div class="doc-section">
                <h4>Performance Tuning</h4>
                <ul class="doc-list">
                    ${generatePerformanceTuning(targetDb)}
                </ul>
            </div>
        `;
        
        // Generate resources content
        const resourcesTab = document.getElementById('resourcesTab');
        resourcesTab.innerHTML = `
            <h3>Helpful Resources</h3>
            <div class="resources-grid">
                ${generateResources(sourceDb, targetDb)}
            </div>
        `;
        
        // Initialize copy buttons
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', function() {
                const target = this.getAttribute('data-clipboard-target');
                const textToCopy = document.querySelector(target).innerText;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    }
    
    // Helper functions
    function getDbName(dbCode) {
        const dbNames = {
            'mysql': 'MySQL',
            'postgresql': 'PostgreSQL',
            'oracle': 'Oracle',
            'sqlserver': 'SQL Server',
            'mongodb': 'MongoDB',
            'sqlite': 'SQLite',
            'mariadb': 'MariaDB',
            'db2': 'IBM DB2',
            'cassandra': 'Cassandra'
        };
        return dbNames[dbCode] || dbCode;
    }
    
    function getDeploymentTypeName(type) {
        const typeNames = {
            'standalone': 'Standalone',
            'cluster': 'Cluster',
            'ha': 'High Availability',
            'dr': 'Disaster Recovery'
        };
        return typeNames[type] || type;
    }
    
    function getStrategyName(strategy) {
        const strategyNames = {
            'bigbang': 'Big Bang Migration',
            'parallel': 'Parallel Run',
            'phased': 'Phased Migration',
            'trickle': 'Trickle Feed'
        };
        return strategyNames[strategy] || strategy;
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Content generation functions
    function generateMigrationSteps(sourceDb, targetDb, deploymentType) {
        let steps = [];
        
        // Common steps
        steps.push('Assess the source database schema and data');
        steps.push('Create a backup of the source database');
        steps.push('Set up the target database environment');
        
        // Source-specific steps
        if (sourceDb === 'oracle') {
            steps.push('Extract Oracle metadata using DBMS_METADATA package');
        } else if (sourceDb === 'mongodb') {
            steps.push('Analyze MongoDB collections and indexes');
        }
        
        // Deployment type specific steps
        if (deploymentType === 'cluster') {
            steps.push('Configure cluster nodes for the target database');
            steps.push('Set up replication and load balancing');
        } else if (deploymentType === 'ha') {
            steps.push('Configure high availability setup with failover');
            steps.push('Test failover scenarios');
        } else if (deploymentType === 'dr') {
            steps.push('Set up disaster recovery site');
            steps.push('Configure replication to DR site');
        }
        
        // Migration steps
        steps.push('Convert schema from source to target format');
        steps.push('Migrate data using appropriate tools');
        steps.push('Validate data consistency between source and target');
        
        // Target-specific steps
        if (targetDb === 'postgresql') {
            steps.push('Optimize PostgreSQL configuration parameters');
        } else if (targetDb === 'sqlserver') {
            steps.push('Configure SQL Server maintenance plans');
        }
        
        // Final steps
        steps.push('Test application connectivity to the new database');
        steps.push('Plan and execute cutover to the new database');
        steps.push('Monitor performance after migration');
        
        return steps.map(step => `<li>${step}</li>`).join('');
    }
    
    function generatePotentialChallenges(sourceDb, targetDb) {
        let challenges = [];
        
        // General challenges
        challenges.push('Data type differences between source and target');
        challenges.push('SQL dialect variations');
        challenges.push('Performance characteristics differences');
        
        // Specific source challenges
        if (sourceDb === 'oracle' && targetDb !== 'oracle') {
            challenges.push('Oracle-specific features like sequences, packages may not have direct equivalents');
        }
        
        if (sourceDb === 'sqlserver' && targetDb === 'mysql') {
            challenges.push('SQL Server T-SQL features not available in MySQL');
        }
        
        if (sourceDb === 'mongodb' && targetDb !== 'mongodb') {
            challenges.push('Converting document model to relational model may require schema redesign');
        }
        
        // Specific target challenges
        if (targetDb === 'postgresql') {
            challenges.push('PostgreSQL case sensitivity for identifiers');
        }
        
        if (targetDb === 'oracle') {
            challenges.push('Oracle licensing costs and complexity');
        }
        
        return challenges.map(challenge => `<li>${challenge}</li>`).join('');
    }
    
    function generateSchemaScript(sourceDb, targetDb, schemaOptions) {
        let script = '';
        
        if (sourceDb === 'mysql' && targetDb === 'postgresql') {
            script = `# MySQL to PostgreSQL Schema Conversion\n\n`;
            
            if (schemaOptions.includes('tables')) {
                script += `# Convert tables\n`;
                script += `pgloader mysql://user:pass@mysql-host/dbname postgresql://user:pass@pg-host/dbname\n\n`;
            }
            
            if (schemaOptions.includes('views')) {
                script += `# Convert views\n`;
                script += `# Note: Some MySQL view syntax may need manual adjustment for PostgreSQL\n\n`;
            }
            
            if (schemaOptions.includes('procedures') || schemaOptions.includes('functions')) {
                script += `# Convert stored procedures/functions\n`;
                script += `# MySQL procedures use different syntax than PostgreSQL PL/pgSQL\n`;
                script += `# Manual conversion is typically required\n\n`;
            }
        } 
        else if (sourceDb === 'sqlserver' && targetDb === 'mysql') {
            script = `# SQL Server to MySQL Schema Conversion\n\n`;
            
            if (schemaOptions.includes('tables')) {
                script += `# Use SQL Server Migration Assistant for MySQL (SSMA)\n`;
                script += `# Or use mysqldump with conversion options\n\n`;
            }
            
            if (schemaOptions.includes('procedures')) {
                script += `# T-SQL to MySQL procedure conversion\n`;
                script += `# Many features like try-catch blocks need rewriting\n\n`;
            }
        }
        else {
            script = `# Schema conversion from ${getDbName(sourceDb)} to ${getDbName(targetDb)}\n\n`;
            script += `# Recommended tool: AWS Database Migration Service\n`;
            script += `# Or use specialized ETL tools like Talend, Informatica\n\n`;
            script += `# For complex migrations, consider commercial tools like:\n`;
            script += `# - Ispirer\n`;
            script += `# - Schema Conversion Tool from AWS\n`;
            script += `# - Oracle SQL Developer Migration Workbench\n`;
        }
        
        return script;
    }
    
    function generateDataScript(sourceDb, targetDb, dataOptions) {
        let script = '';
        
        if (dataOptions.includes('all')) {
            script += `# Complete data migration\n`;
        } else if (dataOptions.includes('partial')) {
            script += `# Partial data migration (selected tables only)\n`;
        } else if (dataOptions.includes('sampled')) {
            script += `# Sampled data migration (for testing)\n`;
        }
        
        if (sourceDb === 'mysql' && targetDb === 'postgresql') {
            script += `pgloader mysql://user:pass@mysql-host/dbname postgresql://user:pass@pg-host/dbname\n\n`;
            script += `# For large databases, consider batch processing:\n`;
            script += `mysqldump -u user -p dbname | psql -h pg-host -U user dbname\n`;
        }
        else if (sourceDb === 'oracle' && targetDb === 'postgresql') {
            script += `# Use ora2pg for Oracle to PostgreSQL migration\n`;
            script += `ora2pg -c config/ora2pg.conf -t COPY -o data_load.sql\n`;
            script += `psql -h pg-host -U user -d dbname -f data_load.sql\n`;
        }
        else {
            script += `# For ${getDbName(sourceDb)} to ${getDbName(targetDb)} data migration:\n`;
            script += `# 1. Export data to intermediate format (CSV, JSON)\n`;
            script += `# 2. Transform data as needed\n`;
            script += `# 3. Import into target database\n\n`;
            script += `# Recommended tools:\n`;
            script += `# - AWS DMS\n`;
            script += `# - Talend Open Studio\n`;
            script += `# - Custom ETL scripts\n`;
        }
        
        return script;
    }
    
    function generateValidationScript(sourceDb, targetDb) {
        let script = `# Validation script for ${getDbName(sourceDb)} to ${getDbName(targetDb)} migration\n\n`;
        
        script += `# 1. Row count comparison\n`;
        script += `# Run on source:\n`;
        script += `SELECT COUNT(*) FROM table_name;\n\n`;
        script += `# Run on target:\n`;
        script += `SELECT COUNT(*) FROM table_name;\n\n`;
        
        script += `# 2. Data checksum comparison (for critical tables)\n`;
        script += `# MySQL example:\n`;
        script += `SELECT BIT_XOR(CAST(CRC32(CONCAT_WS(',',col1,col2,col3)) AS UNSIGNED)) FROM table_name;\n\n`;
        script += `# PostgreSQL example:\n`;
        script += `SELECT md5(CAST(array_agg(t.*) AS text)) FROM table_name t;\n\n`;
        
        script += `# 3. Sample data comparison\n`;
        script += `# Compare random samples of data from both databases\n\n`;
        
        script += `# 4. Application validation\n`;
        script += `# Run application tests against the new database\n`;
        
        return script;
    }
    
    function generateRollbackScript(sourceDb, targetDb) {
        let script = `# Rollback plan for ${getDbName(sourceDb)} to ${getDbName(targetDb)} migration\n\n`;
        
        script += `1. Before migration:\n`;
        script += `   - Take full backup of source database\n`;
        script += `   - Document current application configuration\n\n`;
        
        script += `2. If migration fails:\n`;
        script += `   - Restore source database from backup\n`;
        script += `   - Revert application configuration\n`;
        script += `   - Analyze failure reasons before retrying\n\n`;
        
        script += `3. If issues appear after migration:\n`;
        script += `   - Consider running in parallel mode\n`;
        script += `   - Implement data synchronization\n`;
        script += `   - Gradually shift load back to source if needed\n`;
        
        return script;
    }
    
    function generatePreMigrationChecklist(sourceDb, targetDb) {
        let checklist = [];
        
        // General checklist items
        checklist.push('Verify backup procedures for both source and target');
        checklist.push('Document current performance metrics');
        checklist.push('Identify application dependencies on database');
        checklist.push('Schedule migration during low-traffic period');
        
        // Source-specific items
        if (sourceDb === 'oracle') {
            checklist.push('Review Oracle-specific features (packages, materialized views)');
        }
        
        if (sourceDb === 'mongodb') {
            checklist.push('Analyze document structure and relationships');
        }
        
        // Target-specific items
        if (targetDb === 'postgresql') {
            checklist.push('Configure PostgreSQL parameters for expected workload');
        }
        
        if (targetDb === 'sqlserver') {
            checklist.push('Verify SQL Server edition features match requirements');
        }
        
        return checklist.map(item => `<li>${item}</li>`).join('');
    }
    
    function generateInstallationGuide(targetDb, deploymentType) {
        let guide = '';
        
        if (targetDb === 'postgresql') {
            guide += `<h5>PostgreSQL Installation</h5>`;
            
            if (deploymentType === 'standalone') {
                guide += `<p><strong>Windows:</strong></p>`;
                guide += `<ol>`;
                guide += `<li>Download installer from <a href="https://www.postgresql.org/download/windows/" target="_blank">postgresql.org</a></li>`;
                guide += `<li>Run the installer with default options</li>`;
                guide += `<li>Set superuser password when prompted</li>`;
                guide += `<li>Complete installation and start PostgreSQL service</li>`;
                guide += `</ol>`;
                
                guide += `<p><strong>Linux:</strong></p>`;
                guide += `<pre># Ubuntu/Debian\nsudo apt update\nsudo apt install postgresql postgresql-contrib\n\n# CentOS/RHEL\nsudo yum install postgresql-server postgresql-contrib\nsudo postgresql-setup --initdb\nsudo systemctl start postgresql</pre>`;
            }
            else if (deploymentType === 'cluster') {
                guide += `<h5>PostgreSQL Cluster Setup</h5>`;
                guide += `<ol>`;
                guide += `<li>Install PostgreSQL on all nodes</li>`;
                guide += `<li>Configure streaming replication between nodes</li>`;
                guide += `<li>Set up connection pooling (PgBouncer)</li>`;
                guide += `<li>Configure load balancing</li>`;
                guide += `</ol>`;
            }
            else if (deploymentType === 'ha') {
                guide += `<h5>PostgreSQL High Availability</h5>`;
                guide += `<ol>`;
                guide += `<li>Set up primary and standby servers</li>`;
                guide += `<li>Configure synchronous replication</li>`;
                guide += `<li>Implement automatic failover (Patroni, repmgr)</li>`;
                guide += `<li>Test failover scenarios</li>`;
                guide += `</ol>`;
            }
        }
        else if (targetDb === 'mysql') {
            guide += `<h5>MySQL Installation</h5>`;
            
            if (deploymentType === 'standalone') {
                guide += `<p><strong>Windows:</strong></p>`;
                guide += `<ol>`;
                guide += `<li>Download MySQL Installer from <a href="https://dev.mysql.com/downloads/installer/" target="_blank">mysql.com</a></li>`;
                guide += `<li>Run installer and select "Server only" option</li>`;
                guide += `<li>Configure authentication method (recommend "Strong Password Encryption")</li>`;
                guide += `<li>Set root password and complete installation</li>`;
                guide += `</ol>`;
                
                guide += `<p><strong>Linux:</strong></p>`;
                guide += `<pre># Ubuntu/Debian\nsudo apt update\nsudo apt install mysql-server\n\n# CentOS/RHEL\nsudo yum install mysql-server\nsudo systemctl start mysqld</pre>`;
            }
            else if (deploymentType === 'cluster') {
                guide += `<h5>MySQL Cluster Setup</h5>`;
                guide += `<ol>`;
                guide += `<li>Install MySQL on all nodes</li>`;
                guide += `<li>Configure group replication or NDB cluster</li>`;
                guide += `<li>Set up MySQL Router for load balancing</li>`;
                guide += `<li>Test cluster functionality</li>`;
                guide += `</ol>`;
            }
        }
        else {
            guide += `<p>Installation guide for ${getDbName(targetDb)} ${getDeploymentTypeName(deploymentType)} deployment.</p>`;
            guide += `<p>Refer to official documentation for detailed instructions.</p>`;
        }
        
        return guide;
    }
    
    function generatePostMigrationValidation(sourceDb, targetDb) {
        let validation = [];
        
        // General validation steps
        validation.push('Verify all tables were migrated with correct row counts');
        validation.push('Check data types were converted correctly');
        validation.push('Validate constraints (PK, FK, unique) are enforced');
        validation.push('Test application functionality with the new database');
        validation.push('Compare performance metrics with baseline');
        
        // Specific validations
        if (sourceDb === 'oracle' && targetDb !== 'oracle') {
            validation.push('Verify sequences were properly migrated');
            validation.push('Check PL/SQL to target language conversions');
        }
        
        if (sourceDb === 'mongodb' && targetDb !== 'mongodb') {
            validation.push('Validate document to relational mapping');
            validation.push('Check nested array handling');
        }
        
        return validation.map(item => `<li>${item}</li>`).join('');
    }
    
    function generatePerformanceTuning(targetDb) {
        let tuning = [];
        
        if (targetDb === 'postgresql') {
            tuning.push('Adjust shared_buffers (typically 25% of RAM)');
            tuning.push('Configure effective_cache_size (typically 50-75% of RAM)');
            tuning.push('Set work_mem based on concurrent connections');
            tuning.push('Enable pg_stat_statements for query monitoring');
            tuning.push('Consider partitioning for large tables');
        }
        else if (targetDb === 'mysql') {
            tuning.push('Configure innodb_buffer_pool_size (typically 50-75% of RAM)');
            tuning.push('Set innodb_log_file_size appropriately');
            tuning.push('Optimize query cache settings');
            tuning.push('Enable slow query log for performance analysis');
        }
        else if (targetDb === 'sqlserver') {
            tuning.push('Configure max server memory');
            tuning.push('Set cost threshold for parallelism');
            tuning.push('Create appropriate indexes');
            tuning.push('Update statistics regularly');
        }
        else {
            tuning.push('Review database configuration parameters');
            tuning.push('Create appropriate indexes');
            tuning.push('Monitor query performance');
            tuning.push('Consider partitioning for large datasets');
        }
        
        return tuning.map(item => `<li>${item}</li>`).join('');
    }
    
    function generateResources(sourceDb, targetDb) {
        let resources = [];
        
        // General resources
        resources.push({
            title: 'Database Migration Best Practices',
            url: 'https://aws.amazon.com/blogs/database/database-migration-best-practices/',
            type: 'article'
        });
        
        resources.push({
            title: 'Database Migration Planning Guide',
            url: 'https://cloud.google.com/solutions/database-migration-planning-guide',
            type: 'guide'
        });
        
        // Source-specific resources
        if (sourceDb === 'oracle') {
            resources.push({
                title: 'Oracle Migration Center',
                url: 'https://www.oracle.com/database/technologies/migration-center.html',
                type: 'official'
            });
        }
        
        if (sourceDb === 'sqlserver') {
            resources.push({
                title: 'SQL Server Migration Assistant',
                url: 'https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant',
                type: 'tool'
            });
        }
        
        // Target-specific resources
        if (targetDb === 'postgresql') {
            resources.push({
                title: 'PostgreSQL Documentation',
                url: 'https://www.postgresql.org/docs/',
                type: 'documentation'
            });
            
            resources.push({
                title: 'pgloader - Data loading tool',
                url: 'https://pgloader.io/',
                type: 'tool'
            });
        }
        
        if (targetDb === 'mysql') {
            resources.push({
                title: 'MySQL Documentation',
                url: 'https://dev.mysql.com/doc/',
                type: 'documentation'
            });
        }
        
        // Migration tools
        resources.push({
            title: 'AWS Database Migration Service',
            url: 'https://aws.amazon.com/dms/',
            type: 'service'
        });
        
        resources.push({
            title: 'Talend Open Studio',
            url: 'https://www.talend.com/products/talend-open-studio/',
            type: 'tool'
        });
        
        // Convert resources to HTML
        return resources.map(resource => `
            <div class="resource-card">
                <div class="resource-type ${resource.type}">${capitalizeFirstLetter(resource.type)}</div>
                <h4><a href="${resource.url}" target="_blank">${resource.title}</a></h4>
                <p>${resource.url}</p>
            </div>
        `).join('');
    }
});
