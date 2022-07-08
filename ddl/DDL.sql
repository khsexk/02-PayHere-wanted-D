CREATE TABLE test.`tokens` (
	`id` int NOT NULL AUTO_INCREMENT, 
	`token` varchar(600) NOT NULL, 
	`userAgent` varchar(1000) NOT NULL, 
	`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
	`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
	`expiredAt` datetime NOT NULL, 
    `userId` int NULL, 
    INDEX `id` (`id`), 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE test.`users` (
	`id` int NOT NULL AUTO_INCREMENT, 
    `email` varchar(255) NOT NULL, 
    `password` varchar(255) NOT NULL, 
    `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
    `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
    INDEX `id` (`id`), 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE test.`financialledgers` (
	`id` int NOT NULL AUTO_INCREMENT, 
    `expenditure` int NOT NULL, 
    `income` int NOT NULL, 
    `date` datetime NOT NULL, 
    `remarks` varchar(4000) NOT NULL, 
    `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
    `deletedAt` datetime(6) NULL, 
    `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
    `userId` int NOT NULL, 
    INDEX `user` (`userId`), 
    INDEX `id` (`id`), PRIMARY KEY (`id`)
) ENGINE=InnoDB;

ALTER TABLE test.`tokens` ADD CONSTRAINT `FK_d417e5d35f2434afc4bd48cb4d2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE test.`finantialledgers` ADD CONSTRAINT `FK_461a72541056b424fe32acc7ca3` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION