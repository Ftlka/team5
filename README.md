# Kill0gr@m
## Мы используем
* [Nextjs](https://github.com/zeit/next.js)
* [ESLint](http://eslint.org/): для анализа кода
* [Now](https://zeit.co/now) : для хранения приложения 
* Наше Api для БД 

### Структура проекта 
```
потом
```
### Запуск проекта
```
npm start
```
### Работа с GitHub (console вариант)
1. Делаем fork главного репозитория через сайтик. <br />
    Просто полный клон репозитория на ваш GitHub аккаунт. <br />
2. `git clone 'главный репозиторий' .` <br />
    Скачиваем содержимое репозитория на локальный компьютер в текущую
    папку. <br />
3. `git remote add upstream 'главный репозиторий'` <br />
    Указали на репозиторий из которого будем подтягивать изменения для
    обновления проекта. <br />
    [Убедиться, что всё получилось можно командой: `git remote -v`] <br />
4.  `git checkout -b 'имя вашей новой ветки'` <br />
    Создадим ветку для какой-нибудь супер фичи, в которой продолжим
    разработку. <br />
    [Убедиться, что всё получилось можно командой: `git remote -v`] <br />
5.  `git add 'file[s]'` <br />
    `git commit -m 'type(where): message'` <br />
    `git push origin 'имя вашей новой ветки'` <br />
     Знатно кодим, а после фиксируем все изменения и пушим в ветку. <br />
6.  `git checkout master` <br />
    Переключились на мастер, чтобы подтянуть все изменения из upstream'а. <br />
    `git fetch upstream master` <br />
    Обновили структуру проекта, узнали о ветках и прочее. <br />
    `git pull upstream master` <br />
    Подтянули все обновления. <br />
    `git push origin master` <br />
    Запушили в свой форковский мастер изменения. <br />
7.  `git checkout 'имя вашей новой ветки'` <br />
    Переключаемся обратно на нашу ветку. <br />
    `git merge master` <br />
    Начинаем мёрджить с последними изменения из мастера нашего форка. <br />
    [Вполне возможно, что у вас возникнут конфликты, о чём скажет консоль.
    Загляните в каждый файл и ручками устраните все конфликты] <br />
    `git push origin 'имя вашей новой ветки'` <br />
    Запушили всё в нашу ветку. <br />
8.  Идём на сайт и создаём pull-request, указывая нашу ветку.

### Presentation
1. [Презентация 1](https://docs.google.com/presentation/d/1oHaFruf9TpOrwro5CyCCjyLk92yPLppuKXGgBQDVtSM/edit?usp=sharing)
2. [Презентация 2](https://docs.google.com/presentation/d/1qEp7_4u2XcKBb5s2xuSfoLADI7A8OW62uhL5u_K-9TI/edit?usp=sharing)
3. [Презентация 3](https://docs.google.com/presentation/d/1MISN6BEvGxU9GP6szRIMA7jDj6y86B3aFSds8oB3-k4/edit?usp=sharing)
