-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema quoteandbuild
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema quoteandbuild
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `quoteandbuild` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `quoteandbuild` ;

-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`django_content_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`django_content_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_label` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label` ASC, `model` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 24
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `content_type_id` INT NOT NULL,
  `codename` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id` ASC, `codename` ASC) VISIBLE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co`
    FOREIGN KEY (`content_type_id`)
    REFERENCES `quoteandbuild`.`django_content_type` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 93
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_group_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_group_permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id` ASC, `permission_id` ASC) VISIBLE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id` ASC) VISIBLE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`
    FOREIGN KEY (`permission_id`)
    REFERENCES `quoteandbuild`.`auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `quoteandbuild`.`auth_group` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(128) NOT NULL,
  `last_login` DATETIME(6) NULL DEFAULT NULL,
  `is_superuser` TINYINT(1) NOT NULL,
  `username` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `is_staff` TINYINT(1) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `date_joined` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_user_groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_user_groups` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id` ASC, `group_id` ASC) VISIBLE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `quoteandbuild`.`auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `quoteandbuild`.`auth_user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`auth_user_user_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`auth_user_user_permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id` ASC, `permission_id` ASC) VISIBLE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id` ASC) VISIBLE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`
    FOREIGN KEY (`permission_id`)
    REFERENCES `quoteandbuild`.`auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `quoteandbuild`.`auth_user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`django_admin_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`django_admin_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `action_time` DATETIME(6) NOT NULL,
  `object_id` LONGTEXT NULL DEFAULT NULL,
  `object_repr` VARCHAR(200) NOT NULL,
  `action_flag` SMALLINT UNSIGNED NOT NULL,
  `change_message` LONGTEXT NOT NULL,
  `content_type_id` INT NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id` ASC) VISIBLE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co`
    FOREIGN KEY (`content_type_id`)
    REFERENCES `quoteandbuild`.`django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `quoteandbuild`.`auth_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`django_migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`django_migrations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `app` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `applied` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`django_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`django_session` (
  `session_key` VARCHAR(40) NOT NULL,
  `session_data` LONGTEXT NOT NULL,
  `expire_date` DATETIME(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  INDEX `django_session_expire_date_a5c62663` (`expire_date` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_client` (
  `cedula` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`cedula`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_clientemail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_clientemail` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(254) NOT NULL,
  `cedula_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_clientemail_cedula_id_email_e201a474_uniq` (`cedula_id` ASC, `email` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_cli_cedula_id_e238e659_fk_quoteAndB`
    FOREIGN KEY (`cedula_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_client` (`cedula`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_clientphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_clientphone` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `cedula_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_clientphone_cedula_id_phone_ba768a67_uniq` (`cedula_id` ASC, `phone` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_cli_cedula_id_8fb29e96_fk_quoteAndB`
    FOREIGN KEY (`cedula_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_client` (`cedula`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_project` (
  `project_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(160) NOT NULL,
  PRIMARY KEY (`project_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_clientproject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_clientproject` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(45) NOT NULL,
  `cedula_id` VARCHAR(32) NOT NULL,
  `project_id_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_clientp_cedula_id_project_id_id_01c65745_uniq` (`cedula_id` ASC, `project_id_id` ASC) VISIBLE,
  INDEX `quoteAndBuildApp_cli_project_id_id_17801df6_fk_quoteAndB` (`project_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_cli_cedula_id_bb83fd60_fk_quoteAndB`
    FOREIGN KEY (`cedula_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_client` (`cedula`),
  CONSTRAINT `quoteAndBuildApp_cli_project_id_id_17801df6_fk_quoteAndB`
    FOREIGN KEY (`project_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_project` (`project_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_material`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_material` (
  `material_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`material_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_phase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_phase` (
  `phase_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `project_id_id` INT NOT NULL,
  PRIMARY KEY (`phase_id`),
  INDEX `quoteAndBuildApp_pha_project_id_id_d448347d_fk_quoteAndB` (`project_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_pha_project_id_id_d448347d_fk_quoteAndB`
    FOREIGN KEY (`project_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_project` (`project_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_phaseinterval`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_phaseinterval` (
  `interval_id` INT NOT NULL AUTO_INCREMENT,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `reason` LONGTEXT NULL DEFAULT NULL,
  `phase_id_id` INT NOT NULL,
  PRIMARY KEY (`interval_id`),
  INDEX `quoteAndBuildApp_pha_phase_id_id_56ee02fc_fk_quoteAndB` (`phase_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_pha_phase_id_id_56ee02fc_fk_quoteAndB`
    FOREIGN KEY (`phase_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_phase` (`phase_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_phasematerial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_phasematerial` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `unit_price_estimated` DECIMAL(10,2) NOT NULL,
  `quantity_estimated` DECIMAL(10,2) NOT NULL,
  `material_id_id` INT NOT NULL,
  `phase_id_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_phasema_phase_id_id_material_id__e9807199_uniq` (`phase_id_id` ASC, `material_id_id` ASC) VISIBLE,
  INDEX `quoteAndBuildApp_pha_material_id_id_b26aba72_fk_quoteAndB` (`material_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_pha_material_id_id_b26aba72_fk_quoteAndB`
    FOREIGN KEY (`material_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_material` (`material_id`),
  CONSTRAINT `quoteAndBuildApp_pha_phase_id_id_bd946d02_fk_quoteAndB`
    FOREIGN KEY (`phase_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_phase` (`phase_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_quotes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_quotes` (
  `quote_id` INT NOT NULL AUTO_INCREMENT,
  `quote_date` DATE NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `is_first_quote` TINYINT(1) NOT NULL,
  `phase_id_id` INT NOT NULL,
  PRIMARY KEY (`quote_id`),
  INDEX `quoteAndBuildApp_quo_phase_id_id_7d1645b1_fk_quoteAndB` (`phase_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_quo_phase_id_id_7d1645b1_fk_quoteAndB`
    FOREIGN KEY (`phase_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_phase` (`phase_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_supplier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_supplier` (
  `nit` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(160) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `bank_account` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`nit`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_suppliermaterial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_suppliermaterial` (
  `supplier_material_id` INT NOT NULL AUTO_INCREMENT,
  `actual_price` DECIMAL(10,2) NOT NULL,
  `unit_of_measure` VARCHAR(50) NOT NULL,
  `material_id_id` INT NOT NULL,
  `nit_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`supplier_material_id`),
  UNIQUE INDEX `quoteAndBuildApp_supplie_nit_id_material_id_id_022659ec_uniq` (`nit_id` ASC, `material_id_id` ASC) VISIBLE,
  INDEX `quoteAndBuildApp_sup_material_id_id_b9731e97_fk_quoteAndB` (`material_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_sup_material_id_id_b9731e97_fk_quoteAndB`
    FOREIGN KEY (`material_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_material` (`material_id`),
  CONSTRAINT `quoteAndBuildApp_sup_nit_id_7a25b953_fk_quoteAndB`
    FOREIGN KEY (`nit_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_supplier` (`nit`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_quotesuppliermaterial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_quotesuppliermaterial` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NULL DEFAULT NULL,
  `quote_id_id` INT NOT NULL,
  `supplier_material_id_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_quotesu_quote_id_id_supplier_mat_3232b2e3_uniq` (`quote_id_id` ASC, `supplier_material_id_id` ASC) VISIBLE,
  INDEX `quoteAndBuildApp_quo_supplier_material_id_fe3b8562_fk_quoteAndB` (`supplier_material_id_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_quo_quote_id_id_5c786ece_fk_quoteAndB`
    FOREIGN KEY (`quote_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_quotes` (`quote_id`),
  CONSTRAINT `quoteAndBuildApp_quo_supplier_material_id_fe3b8562_fk_quoteAndB`
    FOREIGN KEY (`supplier_material_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_suppliermaterial` (`supplier_material_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_worker`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_worker` (
  `cedula` VARCHAR(32) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`cedula`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_quoteworker`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_quoteworker` (
  `quote_worker_id` INT NOT NULL AUTO_INCREMENT,
  `quote_id_id` INT NOT NULL,
  `cedula_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`quote_worker_id`),
  UNIQUE INDEX `quoteAndBuildApp_quoteworker_quote_id_id_cedula_id_d7244a00_uniq` (`quote_id_id` ASC, `cedula_id` ASC) VISIBLE,
  INDEX `quoteAndBuildApp_quo_cedula_id_4624bae9_fk_quoteAndB` (`cedula_id` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_quo_cedula_id_4624bae9_fk_quoteAndB`
    FOREIGN KEY (`cedula_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_worker` (`cedula`),
  CONSTRAINT `quoteAndBuildApp_quo_quote_id_id_360eece6_fk_quoteAndB`
    FOREIGN KEY (`quote_id_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_quotes` (`quote_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_supplierphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_supplierphone` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `nit_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_supplierphone_nit_id_phone_1c6ac05b_uniq` (`nit_id` ASC, `phone` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_sup_nit_id_72866921_fk_quoteAndB`
    FOREIGN KEY (`nit_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_supplier` (`nit`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `quoteandbuild`.`quoteAndBuildApp_workerphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `quoteandbuild`.`quoteAndBuildApp_workerphone` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `cedula_id` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `quoteAndBuildApp_workerphone_cedula_id_phone_4a77a9dc_uniq` (`cedula_id` ASC, `phone` ASC) VISIBLE,
  CONSTRAINT `quoteAndBuildApp_wor_cedula_id_e1fe5d54_fk_quoteAndB`
    FOREIGN KEY (`cedula_id`)
    REFERENCES `quoteandbuild`.`quoteAndBuildApp_worker` (`cedula`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
