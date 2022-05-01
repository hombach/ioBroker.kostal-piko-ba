/*global systemDictionary:true */
'use strict';

systemDictionary = {
    'Standard settings': {
        "en": "Standard settings",
        "de": "Standardeinstellungen",
        "ru": "Стандартные настройки",
        "pt": "Configurações padrão",
        "nl": "Standaard instellingen",
        "fr": "Paramètres standards",
        "it": "Impostazioni standard",
        "es": "Configuración estándar",
        "pl": "Ustawienia standardowe",
        "zh-cn": "标准设置"
    },
    'Analog settings': {
        "en": "Settings for analog inputs",
        "de": "Einstellungen für analoge Eingänge",
        "ru": "Настройки для аналоговых входов",
        "pt": "Configurações para entradas analógicas",
        "nl": "Instellingen voor analoge ingangen",
        "fr": "Paramètres des entrées analogiques",
        "it": "Impostazioni per ingressi analogici",
        "es": "Ajustes para entradas analógicas",
        "pl": "Ustawienia wejść analogowych",
        "zh-cn": "模拟输入设置"
    },

    'template adapter settings': {
        'en': 'Adapter settings for Kostal Piko BA',
        'de': 'Adaptereinstellungen für Kostal Piko BA',
        'ru': 'Настройки адаптера для Kostal Piko BA',
        'pt': 'Configurações do adaptador para Kostal Piko BA',
        'nl': 'Adapterinstellingen voor Kostal Piko BA',
        'fr': "Paramètres d'adaptateur pour Kostal Piko BA",
        'it': "Impostazioni dell'adattatore per Kostal Piko BA",
        'es': 'Ajustes del adaptador para Kostal Piko BA',
        'pl': 'Ustawienia adaptera dla Kostal Piko BA',
        'zh-cn': 'Kostal Piko BA的适配器设置'
    },
    'ipaddress': {
        "en": "IP address of Kostal Piko BA (like '192.168.100.33' no HTTP or other texts",
        "de": "IP-Adresse von Kostal Piko BA (wie '192.168.100.33' kein HTTP oder andere Texte",
        "ru": "IP-адрес Kostal Piko BA (например, «192.168.100.33» без HTTP или других текстов",
        "pt": "Endereço IP de Kostal Piko BA (como '192.168.100.33' sem HTTP ou outros textos",
        "nl": "IP-adres van Kostal Piko BA (zoals '192.168.100.33' geen HTTP of andere teksten",
        "fr": "Adresse IP de Kostal Piko BA (comme '192.168.100.33' pas de HTTP ou d'autres textes",
        "it": "Indirizzo IP di Kostal Piko BA (come '192.168.100.33' no HTTP o altri testi",
        "es": "Dirección IP de Kostal Piko BA (como '192.168.100.33' sin HTTP u otros textos",
        "pl": "Adres IP Kostal Piko BA (np. „192.168.100.33” bez HTTP lub innych tekstów)",
        "zh-cn": "Kostal Piko BA 的 IP 地址（如 '192.168.100.33' 没有 HTTP 或其他文本"
    },
    'polltimelive': {
        "en": "Time between data polls from inverter [ms]",
        "de": "Zeit zwischen Datenabfragen vom Wechselrichter [ms]",
        "ru": "Время между опросами данных от инвертора [мс]",
        "pt": "Tempo entre pesquisas de dados do inversor [ms]",
        "nl": "Tijd tussen gegevenspolls van omvormer [ms]",
        "fr": "Temps entre les interrogations de données de l'onduleur [ms]",
        "it": "Tempo tra i polling dei dati dall'inverter [ms]",
        "es": "Tiempo entre encuestas de datos del inversor [ms]",
        "pl": "Czas między odpytywaniem danych z falownika [ms]",
        "zh-cn": "逆变器进行数据轮询之间的时间[ms]"
    },
    'polltimedaily': {
        "en": "Time between data polls from inverter daily statistics [ms]",
        "de": "Zeit zwischen Datenabfragen aus der täglichen Statistik des Wechselrichters [ms]",
        "ru": "Время между опросами данных из ежедневной статистики инвертора [мс]",
        "pt": "Tempo entre as pesquisas de dados das estatísticas diárias do inversor [ms]",
        "nl": "Tijd tussen datapolls van de dagelijkse statistieken van de omvormer [ms]",
        "fr": "Temps entre les interrogations de données à partir des statistiques quotidiennes de l'onduleur [ms]",
        "it": "Tempo tra i sondaggi dati dalle statistiche giornaliere dell'inverter [ms]",
        "es": "Tiempo entre sondeos de datos de las estadísticas diarias del inversor [ms]",
        "pl": "Czas między odpytaniami danych z dziennych statystyk falownika [ms]",
        "zh-cn": "逆变器每日统计数据轮询之间的时间[ms]"
    },
    'polltimetotal': {
        "en": "Time between data polls from inverter alltime statistics [ms]",
        "de": "Zeit zwischen Datenabfragen aus der Wechselrichter-Allzeitstatistik [ms]",
        "ru": "Время между опросами данных постоянной статистики инвертора [мс]",
        "pt": "Tempo entre as pesquisas de dados das estatísticas de todos os tempos do inversor [ms]",
        "nl": "Tijd tussen datapolls van omvormer alltime statistieken [ms]",
        "fr": "Temps entre les interrogations de données à partir des statistiques permanentes de l'onduleur [ms]",
        "it": "Tempo tra i sondaggi di dati dalle statistiche di tutti i tempi dell'inverter [ms]",
        "es": "Tiempo entre sondeos de datos de estadísticas de tiempo del inversor [ms]",
        "pl": "Czas między odpytywaniem danych ze statystyk całego czasu falownika [ms]",
        "zh-cn": "来自逆变器常时统计的数据轮询之间的时间[ms]"
    },

    'readanalogs': {
        "en": "Read-Out all 4 analog input values in V (0-10V; 10bit)",
        "de": "Auslesen aller 4 analogen Eingangswerte in V (0-10V; 10bit)",
        "ru": "Считывание значений всех 4 аналоговых входов в В (0-10 В; 10 бит)",
        "pt": "Leia todos os 4 valores de entrada analógica em V (0-10V; 10 bits)",
        "nl": "Uitlezen van alle 4 analoge ingangswaarden in V (0-10V; 10bit)",
        "fr": "Lecture des 4 valeurs d'entrée analogiques en V (0-10 V ; 10 bits)",
        "it": "Lettura di tutti e 4 i valori di ingresso analogico in V (0-10V; 10bit)",
        "es": "Leer los 4 valores de entrada analógica en V (0-10 V; 10 bits)",
        "pl": "Odczyt wszystkich 4 analogowych wartości wejściowych w V (0-10V; 10bit)",
        "zh-cn": "以 V 为单位读出所有 4 个模拟输入值（0-10V；10 位）"
    },

    'normAnalogs': {
        "en": "Normalizing 0V to minimum value and 10V to maximum value",
        "de": "Normalisierung von 0 V auf Minimalwert und 10 V auf Maximalwert",
        "ru": "Нормализация 0В к минимальному значению и 10В к максимальному значению",
        "pt": "Normalizando 0V para o valor mínimo e 10V para o valor máximo",
        "nl": "Normaliseren van 0V tot minimumwaarde en 10V tot maximumwaarde",
        "fr": "Normalisation de 0V à la valeur minimale et de 10V à la valeur maximale",
        "it": "Normalizzazione di 0 V al valore minimo e 10 V al valore massimo",
        "es": "Normalizando 0V al valor mínimo y 10V al valor máximo",
        "pl": "Normalizacja 0V do wartości minimalnej i 10V do wartości maksymalnej",
        "zh-cn": "将 0V 归一化为最小值，将 10V 归一化为最大值"
    },
    'normAn1Min': {
        "en": "Minimum value for analog input 1 - equals 0V",
        "de": "Minimalwert für Analogeingang 1 - entspricht 0V",
        "ru": "Минимальное значение для аналогового входа 1 - равно 0 В",
        "pt": "Valor mínimo para entrada analógica 1 - igual a 0V",
        "nl": "Minimale waarde voor analoge ingang 1 - is gelijk aan 0V",
        "fr": "Valeur minimale pour l'entrée analogique 1 - égale à 0 V",
        "it": "Il valore minimo per l'ingresso analogico 1 - è uguale a 0V",
        "es": "Valor mínimo para entrada analógica 1 - igual a 0V",
        "pl": "Minimalna wartość dla wejścia analogowego 1 - równa się 0V",
        "zh-cn": "模拟输入 1 的最小值 - 等于 0V"
    },
    'normAn1Max': {
        "en": "Maximum value for analog input 1 - equals 10V",
        "de": "Maximalwert für Analogeingang 1 - entspricht 10 V",
        "ru": "Максимальное значение для аналогового входа 1 - равно 10 В.",
        "pt": "Valor máximo para entrada analógica 1 - igual a 10V",
        "nl": "Maximale waarde voor analoge ingang 1 - is gelijk aan 10V",
        "fr": "Valeur maximale pour l'entrée analogique 1 - égale 10V",
        "it": "Il valore massimo per l'ingresso analogico 1 - equivale a 10V",
        "es": "Valor máximo para entrada analógica 1 - igual a 10V",
        "pl": "Maksymalna wartość dla wejścia analogowego 1 - równa się 10V",
        "zh-cn": "模拟输入 1 的最大值 - 等于 10V"
    },
    'normAn2Min': {
        "en": "Minimum value for analog input 2 - equals 0V",
        "de": "Minimalwert für Analogeingang 2 - entspricht 0V",
        "ru": "Минимальное значение для аналогового входа 2 - равно 0 В",
        "pt": "Valor mínimo para entrada analógica 2 - igual a 0V",
        "nl": "Minimale waarde voor analoge ingang 2 - is gelijk aan 0V",
        "fr": "Valeur minimale pour l'entrée analogique 2 - égale à 0 V",
        "it": "Il valore minimo per l'ingresso analogico 2 - è uguale a 0V",
        "es": "Valor mínimo para entrada analógica 2 - igual a 0V",
        "pl": "Minimalna wartość dla wejścia analogowego 2 - równa się 0V",
        "zh-cn": "模拟输入 2 的最小值 - 等于 0V"
    },
    'normAn2Max': {
        "en": "Maximum value for analog input 2 - equals 10V",
        "de": "Maximalwert für Analogeingang 2 - entspricht 10 V",
        "ru": "Максимальное значение для аналогового входа 2 - равно 10 В.",
        "pt": "Valor máximo para entrada analógica 2 - igual a 10V",
        "nl": "Maximale waarde voor analoge ingang 2 - is gelijk aan 10V",
        "fr": "Valeur maximale pour l'entrée analogique 2 - égale 10V",
        "it": "Il valore massimo per l'ingresso analogico 2 - equivale a 10V",
        "es": "Valor máximo para entrada analógica 2 - igual a 10V",
        "pl": "Maksymalna wartość dla wejścia analogowego 2 - równa się 10V",
        "zh-cn": "模拟输入 2 的最大值 - 等于 10V"
    },
    'normAn3Min': {
        "en": "Minimum value for analog input 3 - equals 0V",
        "de": "Minimalwert für Analogeingang 3 - entspricht 0V",
        "ru": "Минимальное значение для аналогового входа 3 - равно 0 В",
        "pt": "Valor mínimo para entrada analógica 3 - igual a 0V",
        "nl": "Minimale waarde voor analoge ingang 3 - is gelijk aan 0V",
        "fr": "Valeur minimale pour l'entrée analogique 3 - égale à 0 V",
        "it": "Il valore minimo per l'ingresso analogico 3 - è uguale a 0V",
        "es": "Valor mínimo para entrada analógica 3 - igual a 0V",
        "pl": "Minimalna wartość dla wejścia analogowego 3 - równa się 0V",
        "zh-cn": "模拟输入 3 的最小值 - 等于 0V"
    },
    'normAn3Max': {
        "en": "Maximum value for analog input 3 - equals 10V",
        "de": "Maximalwert für Analogeingang 3 - entspricht 10 V",
        "ru": "Максимальное значение для аналогового входа 3 - равно 10 В.",
        "pt": "Valor máximo para entrada analógica 3 - igual a 10V",
        "nl": "Maximale waarde voor analoge ingang 3 - is gelijk aan 10V",
        "fr": "Valeur maximale pour l'entrée analogique 3 - égale 10V",
        "it": "Il valore massimo per l'ingresso analogico 3 - equivale a 10V",
        "es": "Valor máximo para entrada analógica 3 - igual a 10V",
        "pl": "Maksymalna wartość dla wejścia analogowego 3 - równa się 10V",
        "zh-cn": "模拟输入 3 的最大值 - 等于 10V"
    },
    'normAn4Min': {
        "en": "Minimum value for analog input 4 - equals 0V",
        "de": "Minimalwert für Analogeingang 4 - entspricht 0V",
        "ru": "Минимальное значение для аналогового входа 4 - равно 0 В",
        "pt": "Valor mínimo para entrada analógica 4 - igual a 0V",
        "nl": "Minimale waarde voor analoge ingang 4 - is gelijk aan 0V",
        "fr": "Valeur minimale pour l'entrée analogique 4 - égale à 0 V",
        "it": "Il valore minimo per l'ingresso analogico 4 - è uguale a 0V",
        "es": "Valor mínimo para entrada analógica 4 - igual a 0V",
        "pl": "Minimalna wartość dla wejścia analogowego 4 - równa się 0V",
        "zh-cn": "模拟输入 4 的最小值 - 等于 0V"
    },
    'normAn4Max': {
        "en": "Maximum value for analog input 4 - equals 10V",
        "de": "Maximalwert für Analogeingang 4 - entspricht 10 V",
        "ru": "Максимальное значение для аналогового входа 4 - равно 10 В.",
        "pt": "Valor máximo para entrada analógica 4 - igual a 10V",
        "nl": "Maximale waarde voor analoge ingang 4 - is gelijk aan 10V",
        "fr": "Valeur maximale pour l'entrée analogique 4 - égale 10V",
        "it": "Il valore massimo per l'ingresso analogico 4 - equivale a 10V",
        "es": "Valor máximo para entrada analógica 4 - igual a 10V",
        "pl": "Maksymalna wartość dla wejścia analogowego 4 - równa się 10V",
        "zh-cn": "模拟输入 4 的最大值 - 等于 10V"
    }

};
