export let lists = {
    buildings: {
        area: `
        <option value=""></option>
        <option value="ГП">ГП</option>
        <option value="Ямбург">Ямбург</option>
        <option value="ПС САП">ПС САП</option>
        <option value="Новый Уренгой">Новый Уренгой</option>
        `,
        group_1: undefined,
        group_2: undefined,
        queue: `
        <option value=""></option>
        <option value="1">1</option>
        <option value="2">2</option>
        `,
        affiliate: undefined,
        aud_warn_type: `
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        `,
        type_aups: `
        <option value="АСПС">АСПС</option>
        <option value="АСПТ">АСПТ</option>
        <option value="АСПС, АСПТ">АСПС, АСПТ</option>
        <option value="Противопожарный водопровод">Противопожарный водопровод</option>
        <option value="СОУЭ">СОУЭ</option>
        `,
        categ_asu: `
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        `,
    },
    equipment: {
        kind_signal: `
        <option value=""></option>
        <option value="УД">УД</option>
        <option value="ИД">ИД</option>
        <option value="УА">УА</option>
        <option value="ИА">ИД</option>
        <option value="ИУЦ">ИУЦ</option>
        `,
        kind_app: `
        <option value="Оповещатель">Оповещатель</option>
        <option value="Извещатель">Извещатель</option>
        <option value="ППК, и его переферия">ППК, и его переферия</option>
        <option value="Бокс, коробка, щит, шкаф, ящик">Бокс, коробка, щит, шкаф, ящик</option>
        <option value="Питание">Питание</option>
        <option value="Лучи (шлейфа)">Лучи (шлейфа)</option>
        <option value="Оборудование КИПиА">Оборудование КИПиА</option>
        <option value="Пожаротушение">Пожаротушение</option>
        <option value="Реле">Реле</option>
        <option value="Система речевого оповещения">Система речевого оповещения</option>
        <option value="Кабель">Кабель</option>
        <option value="Прочее оборудование">Прочее оборудование</option>
        `,
        kind_app_second: [
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Бокс'},
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Колодка'},
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Коробка'},
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Корпус'},
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Щиты, шкафы'},
            {kind_app: 'Бокс, коробка, щит, шкаф, ящик', kind_app_second: 'Ящик'},
            {kind_app: 'Извещатель', kind_app_second: 'Аналоговый'},
            {kind_app: 'Извещатель', kind_app_second: 'Блок дистанционного ручного пуска'},
            {kind_app: 'Извещатель', kind_app_second: 'Весовые устройства баллонов'},
            {kind_app: 'Извещатель', kind_app_second: 'Дискретный'},
            {kind_app: 'Извещатель', kind_app_second: 'Дымовой'},
            {kind_app: 'Извещатель', kind_app_second: 'Дымовой автономный'},
            {kind_app: 'Извещатель', kind_app_second: 'Дымовой адресный'},
            {kind_app: 'Извещатель', kind_app_second: 'Извещатель комбинированый'},
            {kind_app: 'Извещатель', kind_app_second: 'Извещатель охранный'},
            {kind_app: 'Извещатель', kind_app_second: 'ИК, УФ пламени'},
            {kind_app: 'Извещатель', kind_app_second: 'Кнопка'},
            {kind_app: 'Извещатель', kind_app_second: 'Кнопка КУ'},
            {kind_app: 'Извещатель', kind_app_second: 'Концевик'},
            {kind_app: 'Извещатель', kind_app_second: 'Расход'},
            {kind_app: 'Извещатель', kind_app_second: 'Ручник'},
            {kind_app: 'Извещатель', kind_app_second: 'Сигнализатор давления'},
            {kind_app: 'Извещатель', kind_app_second: 'Сигнализатор уровня'},
            {kind_app: 'Извещатель', kind_app_second: 'Тепловой'},
            {kind_app: 'Извещатель', kind_app_second: 'Тепловой ДПС'},
            {kind_app: 'Кабель', kind_app_second: 'Кабель'},
            {kind_app: 'Лучи (шлейфа)', kind_app_second: 'Лучи (шлейфа)'},
            {kind_app: 'Оборудование КИПиА', kind_app_second: 'Манометр'},
            {kind_app: 'Оповещатель', kind_app_second: 'Арматура светосигнальная'},
            {kind_app: 'Оповещатель', kind_app_second: 'Звонок громкого боя'},
            {kind_app: 'Оповещатель', kind_app_second: 'Звуковой'},
            {kind_app: 'Оповещатель', kind_app_second: 'ИК, УФ пламени'},
            {kind_app: 'Оповещатель', kind_app_second: 'Оповещател'},
            {kind_app: 'Оповещатель', kind_app_second: 'Светильник'},
            {kind_app: 'Оповещатель', kind_app_second: 'Световой'},
            {kind_app: 'Оповещатель', kind_app_second: 'Светозвуковой'},
            {kind_app: 'Оповещатель', kind_app_second: 'Сирена'},
            {kind_app: 'Оповещатель', kind_app_second: 'Табло'},
            {kind_app: 'Питание', kind_app_second: 'Аккумулятор'},
            {kind_app: 'Питание', kind_app_second: 'Блок питания'},
            {kind_app: 'Питание', kind_app_second: 'Бокс'},
            {kind_app: 'Питание', kind_app_second: 'Кнопка'},
            {kind_app: 'Питание', kind_app_second: 'Питание'},
            {kind_app: 'Питание', kind_app_second: 'Фильтр сетевой'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Баллоны'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Весовые устройства баллонов'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Модуль газового пожаротушения'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Направления тушения'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Пиропатроны'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Пожаротушение'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Прочее оборудование'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Сигнализатор давления'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Сигнализатор уровня'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Установка аэрозольного ПТ'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Устройство пожаротушения'},
            {kind_app: 'Пожаротушение', kind_app_second: 'Электромагнитный клапан'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Адресный расширитель'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'АРМ'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Атлас'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Атлас пульт оператора'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Атлас устройство ретрансляции'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Блок индикации'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Блок сигнально-пусковой'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Интерфейс'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Контроллер'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Контрольно-пусковой блок'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'МПКЗ'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Приборы приёмно-контрольные'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Прочее оборудование'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'ПСУ'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Пульт'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Составная чать ППК'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'УКЛСиП'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'УПИ'},
            {kind_app: 'ППК, и его переферия', kind_app_second: 'Фобос'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Автоматический выключатель'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Альбатрос'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Аналоговый  ввод-вывод'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'База'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Блок зажимов'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Блок сигнализации БС'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Дискретный'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Дискретный ввод-вывод'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Заземление'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Звуковой'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Интерфейс'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Карта пямяти'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Конденсатор'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Концевик'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Лампа'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Модуль расширения'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Плата с радиоэлементами'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Предохранитель'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Привод'},
            {
                kind_app: 'Прочее оборудование',
                kind_app_second: 'Промежуточные устройства типа ПИО, АСБ, УКЛСиП, МК…ИК, БИВ (УПКОП), Альбатрос, ПИМ, ВУОС, УКШ'
            },
            {kind_app: 'Прочее оборудование', kind_app_second: 'Процессор'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Прочее оборудовани'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Прочее оборудование'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Пускатель магнитный'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Резистор'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Светильник'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Считыватель'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Транспордер'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Устройство молниезащиты'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'часы'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Электромагнитный клапан'},
            {kind_app: 'Прочее оборудование', kind_app_second: 'Термостат'},
            {kind_app: 'Реле', kind_app_second: 'Реле'},
            {kind_app: 'Реле', kind_app_second: 'УК-ВК'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Громкоговоритель'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Звуковой'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Комплекс аппаратуры оповещения о пожаре'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Контроллер'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Микрофон'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Оповещатель речевой'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Плата с радиоэлементами'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Проигрыватель'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Селектор'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Система речевого оповещения'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Тюнер'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Усилитель звуковой'},
            {kind_app: 'Система речевого оповещения', kind_app_second: 'Устройство трансляционное'},
        ],
    }
}


