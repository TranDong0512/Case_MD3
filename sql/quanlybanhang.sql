create database quanlybanhang;
use quanlybanhang;
create table users(
                      id int not null auto_increment primary key ,
                      name varchar(100),
                      password varchar(100)
);
create table `oder`(
                       idOder int not null auto_increment primary key ,
                       times datetime,
                       total int,
                       idUser int,
                       foreign key (idUser) references users(id)
);
create table category(
                         id int not null auto_increment primary key ,
                         name varchar(100)
);
create table product(
                        idProduct int not null auto_increment primary key ,
                        name varchar(1000),
                        price int,
                        quantity int,
                        idCategory int,
                        foreign key (idCategory) references category(id)
);
create table orderDetail(
                            quantity int,
                            idO int,
                            idP int,
                            foreign key (idO) references oder(idOder),
                            foreign key (idP) references product(idProduct)
);