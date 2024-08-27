USE `tjcars_production`;
DELETE FROM `tjcars_production`.`cfccprices` WHERE `abrv` IN ('evo', 'nh', 'dust');
DELETE FROM `tjcars_production`.`cfccprices_dark` WHERE `abrv` IN ('evo', 'nh', 'dust');
