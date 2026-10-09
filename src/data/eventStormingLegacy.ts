/**
 * Historical Event Storming working model. Rules/exception handling here are
 * proposal-level only and must not override current customer interviews.
 * Shared by historical visualization and SDD evidence export.
 */
export const EVENT_STORMING_LEGACY_RULES = [
    {
      nr: 1,
      title: 'WorkSession ≠ TimesheetEntry',
      titleRu: 'WorkSession ≠ TimesheetEntry (Отметка ≠ Табель оплаты)',
      text: 'Eine gestempelte WorkSession ist nicht automatisch ein freigegebener TimesheetEntry. Erst nach Pausenabzug und Prüfung entsteht ein abrechnungsfähiger Zeiteintrag.',
      textRu: 'Отметка о начале смены не является утвержденным табелем. Только после вычета перерывов и проверки бригадиром формируется запись к оплате.'
    },
    {
      nr: 2,
      title: 'TimesheetEntry ≠ WorkReport',
      titleRu: 'TimesheetEntry ≠ WorkReport (Табель часов ≠ Рапорт выполненных работ)',
      text: 'Ein Zeiteintrag ist kein Arbeitsrapport. Die geleisteten Arbeitsstunden für den Lohn sind unabhängig von den produzierten Bohrmetern und Schnittflächen auf der Baustelle.',
      textRu: 'Запись времени — это не производственный рапорт. Часы для зарплаты независимы от фактически пробуренных отверстий и погонных метров резки.'
    },
    {
      nr: 3,
      title: 'GPS ist Nachweis, kein Lohnabzug',
      titleRu: 'GPS — это подтверждение присутствия, а не повод резать зарплату',
      text: 'GPS dient ausschließlich als Plausibilitätsnachweis beim Einstempeln. Eine Standortabweichung darf keinen automatischen Lohnabzug bewirken, sondern führt zu einer Vorarbeiter-Prüfaufgabe.',
      textRu: 'GPS используется исключительно для валидации точки входа. Смещение геозоны не должно штрафовать рабочего, а создает задачу проверки бригадиру.'
    },
    {
      nr: 4,
      title: 'Getrennte Freigabepfade',
      titleRu: 'Раздельные контуры согласования (Часы vs Рапорты)',
      text: 'Stundenfreigabe (für Lohn/Tripletex) und Rapportfreigabe (für Kundenabrechnung/Aufmaß) sind fachlich unabhängig. Verzögerte Aufmaßprüfungen blockieren die Stundenerfassung nicht.',
      textRu: 'Согласование часов (для зарплаты) и согласование рапорта (для счета клиенту) независимы. Споры по объемам не блокируют выплату часов.'
    },
    {
      nr: 5,
      title: 'Kundenunterschrift & ERP-Export entkoppelt',
      titleRu: 'Подпись клиента и экспорт часов в ERP развязаны',
      text: 'Eine Kundenunterschrift ist keine zwingende Voraussetzung für den internen Stundenexport nach Tripletex. Kunden erhalten SMS-Magic-Links zur asynchronen Prüfung.',
      textRu: 'Подпись клиента не является обязательным блокером для экспорта часов в Tripletex. Заказчик согласует объемы асинхронно по временной ссылке.'
    },
    {
      nr: 6,
      title: 'Exportfehler stornieren keine Freigabe',
      titleRu: 'Ошибки экспорта в ERP не отменяют согласование бригадира',
      text: 'Schlägt der API-Aufruf an Tripletex fehl, bleibt der Datensatz fachlich freigegeben. Der Fehler wird in einer Retry-Warteschlange behandelt.',
      textRu: 'При сетевом сбое Tripletex статус согласования остается в силе. Запрос автоматически ставится в очередь повтора (Retry).'
    },
    {
      nr: 7,
      title: 'Unveränderlicher PriceSnapshot',
      titleRu: 'Неизменяемый снимок цен PriceSnapshot',
      text: 'Ein freigegebener Arbeitsrapport friert alle Konditionen in einem PriceSnapshot ein. Spätere Preisänderungen in der Stammdatenliste dürfen bestehende Rapporte niemals unbemerkt mutieren.',
      textRu: 'Утвержденный рапорт замораживает тарифы в PriceSnapshot. Будущие изменения цен в справочнике компании не имеют права менять старые рапорты.'
    },
    {
      nr: 8,
      title: 'Revisionssichere Korrekturen',
      titleRu: 'Версионированные ревизии вместо перезаписи базы',
      text: 'Nachträgliche Änderungen an bereits freigegebenen Objekten erzeugen zwingend eine neue Version (WorkReportRevision) mit dokumentiertem Grund und Audit-Trail.',
      textRu: 'Правки утвержденных документов создают новую версию (WorkReportRevision) с обязательным указанием причины для аудита.'
    },
    {
      nr: 9,
      title: 'Strikte Export-Idempotenz',
      titleRu: 'Строгая идемпотентность экспорта (Idempotency Key)',
      text: 'Wiederholte API-Aufrufe an Tripletex (z. B. nach Netzwerk-Timeout) dürfen niemals zu doppelten Stundeneinträgen führen. Jeder Export führt einen Idempotency-Key.',
      textRu: 'Повторные запросы к API Tripletex никогда не создают дублей часов. Каждая операция снабжается уникальным Idempotency-Key.'
    },
    {
      nr: 10,
      title: 'Offline-First mit Client-UUIDs',
      titleRu: 'Offline-First архитектура с клиентскими UUID',
      text: 'Offline-Aktionen auf dem Smartphone generieren eigene Client-UUIDs. Bei Wiederverbindung erfolgt eine geordnete, konfliktfreie Synchronisation gegen das Backend.',
      textRu: 'Все действия на смартфоне генерируют собственные UUID. При выходе из подвала в зону сети данные синхронизируются без конфликтов.'
    }
  ];

export const EVENT_STORMING_LEGACY_EXCEPTIONS = [
    {
      case: 'GPS-Signal fehlt oder ungenau (>100m)',
      caseRu: 'GPS-сигнал отсутствует или погрешность >100м',
      handling: 'Clock-in wird nicht blockiert. Event "ClockInExceptionRecorded" markiert den Eintrag zur Vorarbeiter-Sichtung.',
      handlingRu: 'Вход не блокируется. Событие ClockInExceptionRecorded ставит запись на подтверждение бригадиру.'
    },
    {
      case: 'Mitarbeiter außerhalb des Geofence',
      caseRu: 'Рабочий чекинится вне радиуса геозоны объекта',
      handling: 'Ausnahme wird registriert; Vorarbeiter prüft, ob es sich um Baustelleneinrichtung oder Materiallager handelte.',
      handlingRu: 'Исключение фиксируется; бригадир проверяет, была ли это база материалов или смежная площадка.'
    },
    {
      case: 'Vollständiger Offline-Betrieb (Keller/Tiefgarage)',
      caseRu: 'Полное отсутствие связи (подвал / подземный паркинг)',
      handling: 'Alle Zeiten, Bohrpositionen und Fotos werden in lokaler SQLite gespeichert. Synchronisation erfolgt automatisch bei Netzrückkehr.',
      handlingRu: 'Все смены, замеры и фото сохраняются в локальную SQLite. Фоновая синхронизация запускается при появлении сети.'
    },
    {
      case: 'Vergessenes Ausstempeln am Schichtende',
      caseRu: 'Рабочий забыл нажать "Стоп" в конце смены',
      handling: 'Session bleibt offen oder wird nach Maximalzeit beendet. Vorarbeiter erhält Korrekturaufgabe mit Hinweisfenster.',
      handlingRu: 'Смена закрывается по лимиту или остается на ручное закрытие; бригадиру приходит задача на корректировку времени.'
    },
    {
      case: 'Kunde reagiert nicht auf Magic-Link',
      caseRu: 'Заказчик не открывает ссылку согласования',
      handling: 'Link läuft nach Frist ab. Rapport verbleibt kaufmännisch freigegeben; Mahnprozess im Büro greift.',
      handlingRu: 'Ссылка истекает по тайм-ауту. Рапорт считается принятым внутренне; офис запускает процедуру напоминания.'
    },
    {
      case: 'Kunde lehnt Rapport oder Positionen ab',
      caseRu: 'Заказчик оспаривает замеры или объем работ',
      handling: 'Event "CustomerReportRejected" löst Klärungsfall aus; Büro und Vorarbeiter passen Mengen an und erstellen neue Revision.',
      handlingRu: 'Событие CustomerReportRejected открывает спорный тикет; бригадир и офис уточняют объемы и выпускают ревизию.'
    },
    {
      case: 'Tripletex-API nicht erreichbar / Export fehlgeschlagen',
      caseRu: 'API Tripletex временно недоступен / сбой передачи',
      handling: 'Event "TripletexExportFailed" löst automatischen Retry-Zyklus aus. Fachliche Freigabe bleibt uneingeschränkt bestehen.',
      handlingRu: 'Событие TripletexExportFailed ставит задачу в очередь повторов. Согласование внутри ISA не отменяется.'
    },
    {
      case: 'Nachträgliche Änderung nach erfolgreichem ERP-Export',
      caseRu: 'Изменение данных уже ПОСЛЕ успешной выгрузки в Tripletex',
      handling: 'Erfordert Stornobuchung oder Differenzkorrektur über versionierte Revision im Backend.',
      handlingRu: 'Требует оформления сторно или дельта-корректировки через новую ревизию с аудитом.'
    }
  ];
