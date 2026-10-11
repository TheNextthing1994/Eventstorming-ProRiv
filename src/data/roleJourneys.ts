import type { TopicId } from '../types';

export type JourneyRoleId = 'worker' | 'foreman' | 'admin';
export type LocalizedText = { de: string; ru: string };
export type JourneyQuestion = {
  id: string;
  text: LocalizedText;
  previousAnswer?: LocalizedText;
  provenance?: 'interview' | 'team';
};
export type JourneyStep = {
  id: string;
  phase: LocalizedText;
  title: LocalizedText;
  situation: LocalizedText;
  action: LocalizedText;
  system: LocalizedText;
  handover: LocalizedText;
  targetRole?: JourneyRoleId;
  processStepId?: string;
  exceptions: LocalizedText;
  basis: LocalizedText;
  source: string;
  topicId: TopicId;
  questions: JourneyQuestion[];
};
export type RoleJourney = {
  id: JourneyRoleId;
  name: LocalizedText;
  purpose: LocalizedText;
  boundary: LocalizedText;
  steps: JourneyStep[];
  processStepIds: string[];
};

const l = (de: string, ru: string): LocalizedText => ({ de, ru });
const teamSource = 'docs/TEAM_ENTWURF_ROLLEN_RAPPORT_2026-10-09.md';
const interviewSource = 'src/data/workshopContent.ts';

// A walkthrough proposal, not an implementation of the employee application.
// Keep interview, team hypotheses and new suggestions distinct. Stable IDs are
// used in the existing WorkshopNotes store; no seed answer is marked decided.
export const ADMIN_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'access', phase: l('Einrichtung', 'Подготовка'), topicId: 'users',
    title: l('Admin-Zugang übernehmen', 'Получить доступ администратора'),
    situation: l('Die Firma startet mit der App. Eine benannte Person soll die Einrichtung und die Zugänge verantworten.', 'Компания начинает работу с приложением. Назначенному человеку нужно поручить настройку и управление доступом.'),
    action: l('Der Admin erhält einen Zugang, meldet sich an und prüft, dass er die richtige Firma verwaltet. Er legt fest, wer ihn bei Abwesenheit vertritt.', 'Администратор получает доступ, входит и проверяет, что управляет нужной компанией. Определяет, кто заменит его в отсутствие.'),
    system: l('Die App zeigt Firmenname und eigene Rolle. Der erste Admin muss bereits legitim eingerichtet sein; weitere Admins werden gezielt berechtigt.', 'Приложение показывает компанию и роль. Первый администратор должен быть назначен уполномоченным лицом; остальным доступ выдаётся отдельно.'),
    handover: l('Isa bestätigt die verantwortliche Person und ihren Stellvertreter. Danach beginnt die Firmeneinrichtung.', 'Иса подтверждает ответственного и заместителя. После этого начинается настройка компании.'),
    exceptions: l('Einladung fehlt, Link ist abgelaufen oder falsche Firma angezeigt: Zugang prüfen und Einladung erneuern. Erstanmeldung und Rechtevergabe benötigen Internet.', 'Нет приглашения, ссылка просрочена или указана другая компания: проверить доступ и отправить новое приглашение. Первый вход и назначение прав требуют интернета.'),
    basis: l('Der Team-Entwurf nennt einen Admin. Wer ihn erstmals einrichtet und ob mehrere Admins nötig sind, ist offen.', 'В командном черновике есть администратор. Кто создаёт первый доступ и сколько администраторов нужно, пока не решено.'),
    source: teamSource,
    questions: [
      { id: 'first-admin', text: l('Isa, wer soll der erste Admin sein, und wer richtet seinen Zugang ein?', 'Иса, кто будет первым администратором и кто выдаст ему доступ?') },
      { id: 'deputy', text: l('Wer übernimmt, wenn der Admin im Urlaub ist? Soll diese Person dieselben Rechte bekommen?', 'Кто заменит администратора во время отпуска? Нужны ли заместителю такие же права?') }
    ]
  },
  {
    id: 'company', phase: l('Einrichtung', 'Подготовка'), topicId: 'api',
    title: l('Firma und Tripletex verbinden', 'Настроить компанию и Tripletex'),
    situation: l('Vor der ersten Einladung muss klar sein, welche Firma und welche bestehenden Stammdaten die App verwendet.', 'До первого приглашения нужно определить компанию и источник существующих данных.'),
    action: l('Der Admin prüft Firmendaten und benennt die Person mit Tripletex-Zugriffsrechten. Gemeinsam ordnen sie Mitarbeiter und Projekte den bestehenden Einträgen zu.', 'Администратор проверяет данные компании и определяет, кто имеет доступ к Tripletex. Вместе они сопоставляют сотрудников и объекты с существующими записями.'),
    system: l('Die App zeigt den Verbindungsstatus und eindeutige Zuordnungen. Ein Test mit einem Mitarbeiter und einem Projekt prüft die Verbindung vor der Nutzung.', 'Приложение показывает статус подключения и соответствие записей. Перед запуском проверяется один сотрудник и один объект.'),
    handover: l('Die berechtigte Person in Tripletex unterstützt die Einrichtung. Buchhaltung bleibt in Tripletex; sie wird dadurch nicht automatisch App-Admin.', 'Уполномоченный пользователь Tripletex помогает с настройкой. Бухгалтерия остаётся в Tripletex и не становится администратором приложения автоматически.'),
    processStepId: 'export',
    exceptions: l('Fehlende Rechte oder doppelte Datensätze: Verbindung nicht als fertig anzeigen. Nichts auf Verdacht übertragen; fehlerhafte Zuordnung berichtigen und erneut testen.', 'Недостаточно прав или есть дубли: не показывать подключение как готовое. Не передавать данные наугад; исправить соответствие и повторить проверку.'),
    basis: l('Projektstunden sollen nach Tripletex. Der führende Ort für Mitarbeiter- und Projektdaten sowie die Zuständigkeit für die Verbindung sind noch offen.', 'Часы должны поступать в Tripletex. Где ведутся основные данные сотрудников и объектов и кто отвечает за подключение, ещё нужно уточнить.'),
    source: interviewSource,
    questions: [
      { id: 'master-data', text: l('Pflegt ihr Mitarbeiter und Projekte zuerst in Tripletex oder in unserer App? Welche Einträge sollen übernommen werden?', 'Где вы сначала создаёте сотрудников и объекты: в Tripletex или в нашем приложении? Какие записи нужно перенести?') },
      { id: 'connection-owner', text: l('Wer kann den Tripletex-Zugang für die Verbindung freigeben und einen Test mit uns durchführen?', 'Кто может предоставить доступ для подключения Tripletex и провести с нами тест?') },
      { id: 'payroll-system', text: l('Bleiben Stundenprüfung und Lohnverarbeitung in Tripletex? Muss die Buchhaltung unsere App überhaupt öffnen?', 'Проверка часов и зарплата остаются в Tripletex? Нужно ли бухгалтерии открывать наше приложение?'), previousAnswer: l('Gesprächsgrundlage: Der Vorarbeiter prüft Stunden und die Buchhaltung verarbeitet den Lohn in Tripletex; für die Buchhaltung wurde kein App-Zugang benötigt.', 'По исходному разговору: прораб проверяет часы, бухгалтерия оформляет зарплату в Tripletex; доступ к приложению бухгалтерии не требовался.'), provenance: 'interview' }
    ]
  },
  {
    id: 'invite', phase: l('Menschen', 'Люди'), topicId: 'users',
    title: l('Mitarbeiter einladen', 'Пригласить сотрудника'),
    situation: l('Ein neuer Arbeiter oder Vorarbeiter soll Zugang bekommen. Er hat noch kein aktives Profil in der App.', 'Новому рабочему или прорабу нужен доступ. Активного профиля в приложении ещё нет.'),
    action: l('Der Admin sucht zuerst nach einem bestehenden Profil. Dann trägt er Name, Kontakt und vorgesehene Rolle ein und verschickt die Einladung.', 'Администратор сначала ищет существующий профиль. Затем вводит имя, контакт и предполагаемую роль и отправляет приглашение.'),
    system: l('Einladungsstatus: eingeladen, angenommen oder abgelaufen. Ein erneuter Versand bezieht sich auf dasselbe Profil und erstellt keinen zweiten Mitarbeiter.', 'Статус приглашения: отправлено, принято или просрочено. Повторная отправка относится к тому же профилю и не создаёт второго сотрудника.'),
    handover: l('Der Mitarbeiter öffnet den Link, bestätigt seinen Zugang und ergänzt sein Profil. Die Baustellenzuordnung ist ein eigener Schritt.', 'Сотрудник открывает ссылку, подтверждает доступ и дополняет профиль. Назначение на объект выполняется отдельно.'),
    targetRole: 'worker',
    exceptions: l('Falsche Nummer, fehlende E-Mail oder abgelaufener Link: Kontakt korrigieren und erneut senden. Ohne Internet bleibt die Einladung ungesendet; erst die Zustellmeldung zählt.', 'Неверный номер, нет почты или ссылка просрочена: исправить контакт и отправить заново. Без интернета приглашение остаётся неотправленным; нужна подтверждённая отправка.'),
    basis: l('Teamvorschlag: Admin registriert Beschäftigte; Vorarbeiter lädt sie auf eine Baustelle ein. App-Zugang und Baustelleneinladung müssen getrennt geklärt werden.', 'Предложение команды: администратор регистрирует сотрудников, прораб приглашает на объект. Доступ в приложение и назначение на объект нужно уточнить отдельно.'),
    source: teamSource,
    questions: [
      { id: 'inviter', text: l('Wer verschickt den ersten App-Zugang: Admin, Vorarbeiter oder Isa? Wer darf nur auf eine Baustelle zuordnen?', 'Кто отправляет первый доступ в приложение: администратор, прораб или Иса? Кто может только назначать на объект?'), previousAnswer: l('Teamvorschlag: Admin registriert Mitarbeiter; Vorarbeiter lädt Mitarbeiter auf das Objekt ein. Von Isa noch nicht bestätigt.', 'Предложение команды: администратор регистрирует сотрудников; прораб приглашает на объект. Иса ещё не подтвердил.'), provenance: 'team' },
      { id: 'channel', text: l('Soll der Einladungslink per SMS oder E-Mail kommen? Was machen wir bei Mitarbeitern ohne E-Mail?', 'Ссылку отправляем по SMS или электронной почте? Что делать, если у сотрудника нет почты?') },
      { id: 'expiry', text: l('Wie lange ist der Link gültig, und wer darf eine Einladung erneut schicken oder zurückziehen?', 'Сколько действует ссылка и кто может отправить её повторно или отменить приглашение?') }
    ]
  },
  {
    id: 'profile', phase: l('Menschen', 'Люди'), topicId: 'users',
    title: l('Profil und Rechte freigeben', 'Проверить профиль и права'),
    situation: l('Der Mitarbeiter hat den Link angenommen. Vor der ersten Schicht müssen Profil und Berechtigungen brauchbar sein.', 'Сотрудник принял приглашение. До первой смены нужно проверить профиль и разрешения.'),
    action: l('Der Admin prüft die vereinbarten Pflichtangaben, die Tripletex-Zuordnung und die Rolle. Er klärt, ob Preise sichtbar sind und wer Rapporte senden oder Korrekturen vornehmen darf.', 'Администратор проверяет обязательные данные, привязку к Tripletex и роль. Уточняет видимость цен и право отправлять рапорты или вносить исправления.'),
    system: l('Das Profil zeigt fehlende Pflichtfelder und den Aktivierungsstatus. Rechte werden wirksam vergeben; ein vervollständigtes Profil allein beweist keine Freigabe.', 'Профиль показывает недостающие поля и статус активации. Права назначаются отдельно; заполненный профиль сам по себе не означает разрешение на работу.'),
    handover: l('Der Mitarbeiter sieht seine Rolle und nächste Aufgabe. Der Vorarbeiter erhält den Mitarbeiter in seiner Mannschaft, sofern zugeordnet.', 'Сотрудник видит свою роль и следующую задачу. Прораб видит его в своей бригаде после назначения.'),
    targetRole: 'worker',
    exceptions: l('Fehlende Daten oder falsche Rolle: konkrete Lücke zeigen und gezielt nachfordern. Rechteänderung braucht Verbindung; offline gespeicherte Arbeit darf dabei nicht still verloren gehen.', 'Нет данных или неверная роль: показать конкретный пробел и запросить исправление. Изменение прав требует связи; сохранённая оффлайн работа не должна незаметно пропасть.'),
    basis: l('Drei interne Rollen sind ein Teamvorschlag. Pflichtfelder, Preisrechte und die Notwendigkeit einer HMS-Kartennummer sind offen.', 'Три внутренние роли предложены командой. Обязательные поля, доступ к ценам и необходимость номера HMS-карты ещё не определены.'),
    source: teamSource + ' · ' + interviewSource,
    questions: [
      { id: 'required-data', text: l('Welche Angaben braucht ihr vor der ersten Schicht wirklich: Name, Telefon, Personalnummer, Sprache oder HMS-Kartennummer? Wer trägt sie ein?', 'Какие данные реально нужны до первой смены: имя, телефон, табельный номер, язык или номер HMS-карты? Кто их вводит?') },
      { id: 'worker-rights', text: l('Darf jeder Arbeiter Preise sehen und Rapporte versenden, oder nur ein benannter Verantwortlicher? Darf jemand mehrere Rollen haben?', 'Каждый рабочий может видеть цены и отправлять рапорты или только назначенный ответственный? Можно ли совмещать несколько ролей?'), previousAnswer: l('Das Gespräch beschreibt den direkten Rapportversand durch Arbeiter; der Team-Entwurf nennt einen benannten Verantwortlichen. Das ist ein offener Konflikt.', 'В разговоре рабочий отправляет рапорт напрямую; в командном черновике это делает назначенный ответственный. Есть неразрешённое расхождение.'), provenance: 'interview' }
    ]
  },
  {
    id: 'site', phase: l('Einsatz vorbereiten', 'Подготовить работу'), topicId: 'clients',
    title: l('Kunde und Baustelle vorbereiten', 'Подготовить клиента и объект'),
    situation: l('Ein neuer Auftrag beginnt. Die Mannschaft braucht einen eindeutig erkennbaren Einsatzort und den richtigen Rapportempfänger.', 'Начинается новый заказ. Бригаде нужен понятный объект и правильный получатель рапорта.'),
    action: l('Der Admin übernimmt oder erstellt den Kunden und die Baustelle. Er prüft Projektkennung, Adresse, Ansprechpartner und Empfänger für SMS/E-Mail; Standortregeln werden nur nach Klärung ergänzt.', 'Администратор импортирует или создаёт клиента и объект. Проверяет номер проекта, адрес, контакт и получателя SMS/почты; правила местоположения добавляются после согласования.'),
    system: l('Die Baustelle erhält einen eindeutigen Bezug zum Tripletex-Projekt, falls dort vorhanden. Unvollständige Kontakt- oder Projektangaben bleiben sichtbar.', 'Объект связывается с проектом Tripletex, если он там существует. Отсутствующие контакты или реквизиты проекта отображаются явно.'),
    handover: l('Der zuständige Vorarbeiter bekommt die vorbereitete Baustelle und prüft, dass Ort und Ansprechpartner stimmen.', 'Назначенный прораб получает подготовленный объект и проверяет место и контакт.'),
    targetRole: 'foreman',
    exceptions: l('Doppelter Kunde, falsche Adresse oder geänderter Ansprechpartner: bestehende Daten berichtigen. Neue Baustellen ohne Verbindung nicht als einsatzbereit ausgeben.', 'Дубли клиента, неверный адрес или новый контакт: исправить существующие записи. Новый объект без связи не показывать как готовый к работе.'),
    basis: l('Teamvorschlag: Admin erstellt Baustellen. Ob diese zuerst in Tripletex entstehen und wer Kontaktänderungen pflegt, ist offen.', 'Предложение команды: администратор создаёт объекты. Где их создают сначала и кто обновляет контакты, пока не решено.'),
    source: teamSource,
    questions: [
      { id: 'site-owner', text: l('Wer legt eine Baustelle an, und welche Angaben müssen vorhanden sein, bevor die Arbeiter sie sehen?', 'Кто создаёт объект и какие данные должны быть заполнены, прежде чем рабочие его увидят?'), previousAnswer: l('Teamvorschlag: Der Admin erstellt das Objekt und ordnet einen Vorarbeiter zu.', 'Предложение команды: администратор создаёт объект и назначает прораба.'), provenance: 'team' },
      { id: 'recipient', text: l('Wer bestimmt den Rapportempfänger? Kann eine Baustelle mehrere Ansprechpartner haben, und wer hält deren Telefonnummern aktuell?', 'Кто назначает получателя рапорта? Может ли у объекта быть несколько контактов и кто обновляет их телефоны?') },
      { id: 'location-policy', text: l('Soll die Baustelle eine GPS-Zone oder einen QR-Code bekommen? Wer entscheidet bei schlechtem GPS oder fehlendem Internet über eine Ausnahme?', 'Нужна ли объекту GPS-зона или QR-код? Кто разрешает исключение при плохом GPS или отсутствии интернета?') }
    ]
  },
  {
    id: 'assignment', phase: l('Einsatz vorbereiten', 'Подготовить работу'), topicId: 'users',
    title: l('Vorarbeiter und Mannschaft zuordnen', 'Назначить прораба и бригаду'),
    situation: l('Die Baustelle existiert. Noch ist nicht klar, wer sie betreut, dort arbeiten darf oder den gemeinsamen Rapport erstellt.', 'Объект создан. Нужно определить, кто его ведёт, кто может работать и кто готовит общий рапорт.'),
    action: l('Der Admin ordnet den zuständigen Vorarbeiter zu. Die zuständige Person wählt die Mannschaft und gegebenenfalls den Rapport-Verantwortlichen; Wechsel werden gezielt durchgeführt.', 'Администратор назначает прораба. Ответственный выбирает бригаду и, если нужно, автора общего рапорта; изменения выполняются отдельно.'),
    system: l('Die App zeigt Verantwortlichen und zugeordnete Mitarbeiter. Eine Baustellenzuordnung ändert nicht automatisch die allgemeine App-Rolle.', 'Приложение показывает ответственного и сотрудников. Назначение на объект не меняет общую роль в приложении автоматически.'),
    handover: l('Der Vorarbeiter übernimmt die Baustelle, bestätigt die Mannschaft und klärt die Aufgaben vor Arbeitsbeginn.', 'Прораб принимает объект, подтверждает бригаду и уточняет задания до начала работы.'),
    targetRole: 'foreman',
    exceptions: l('Vorarbeiter fällt aus oder Arbeiter wechselt die Baustelle: Vertretung beziehungsweise neue Zuordnung festlegen. Bereits erfasste Zeiten behalten ihren ursprünglichen Projektbezug.', 'Прораб отсутствует или рабочий меняет объект: назначить замену либо новый объект. Уже записанные часы сохраняют исходную привязку к проекту.'),
    basis: l('Teamvorschlag: Admin weist Vorarbeiter zu; Vorarbeiter stellt die Mannschaft zusammen und benennt den Rapport-Verantwortlichen.', 'Предложение команды: администратор назначает прораба; прораб выбирает бригаду и ответственного за рапорт.'),
    source: teamSource,
    questions: [
      { id: 'assignment-owner', text: l('Darf der Vorarbeiter seine Mannschaft selbst ändern, oder macht das immer der Admin? Kann ein Arbeiter mehrere Baustellen am Tag haben?', 'Прораб сам меняет состав бригады или это всегда делает администратор? Может ли рабочий работать на нескольких объектах за день?') },
      { id: 'report-owner', text: l('Braucht jede Baustelle einen benannten Rapport-Verantwortlichen? Wer übernimmt, wenn er ausfällt?', 'Нужен ли на каждом объекте назначенный ответственный за рапорт? Кто заменяет его в отсутствие?'), previousAnswer: l('Der Team-Entwurf schlägt einen verantwortlichen Arbeiter für den gemeinsamen Rapport vor; im Gespräch war dies noch keine Pflicht.', 'Командный черновик предлагает одного ответственного рабочего для общего рапорта; в разговоре это не было обязательным.'), provenance: 'team' }
    ]
  },
  {
    id: 'prices', phase: l('Einsatz vorbereiten', 'Подготовить работу'), topicId: 'raport',
    title: l('Preisgrundlage bereitstellen', 'Подготовить цены'),
    situation: l('Der Rapport soll Mengen und gegebenenfalls Preise enthalten. Dafür muss vor dem Einsatz die richtige Preisgrundlage verfügbar sein.', 'Рапорт должен содержать объёмы и, при необходимости, цены. До работы нужно подготовить правильный прайс.'),
    action: l('Die berechtigte Person wählt die gültige Preisliste und vereinbarte Kundensonderpreise. Der Admin prüft, ob diese der Baustelle zugeordnet und für die Erfassung verfügbar sind.', 'Уполномоченный человек выбирает действующий прайс и особые цены клиента. Администратор проверяет привязку к объекту и доступность для ввода работ.'),
    system: l('Die App zeigt verwendete Preisversion und fehlende Regeln. Eine neue Preisliste soll bereits versandte Rapporte nicht unbemerkt nachträglich verändern.', 'Приложение показывает версию прайса и отсутствующие правила. Новый прайс не должен незаметно менять уже отправленные рапорты.'),
    handover: l('Die Mannschaft erhält die benötigten Arbeitsarten und Preisregeln. Ob Arbeiter Preise sehen, wird gesondert entschieden.', 'Бригада получает нужные виды работ и правила расчёта. Видимость цен для рабочих решается отдельно.'),
    targetRole: 'worker', processStepId: 'pricing',
    exceptions: l('Preis fehlt oder Sonderpreis widerspricht dem Standard: als Klärungsfall anzeigen. Ob ein Rapport ohne Preis versendet werden darf, entscheidet Isa.', 'Нет цены или особая цена конфликтует со стандартной: показать необходимость уточнения. Можно ли отправить рапорт без цены, решает Иса.'),
    basis: l('Gesprächsgrundlage: bestehende Preislisten und Kundenrabatte. Die Pflege durch den Admin ist ein Vorschlag, keine bestätigte Zuständigkeit.', 'По разговору уже есть прайсы и скидки клиентов. Управление ими администратором — предложение, а не подтверждённая обязанность.'),
    source: interviewSource,
    questions: [
      { id: 'price-owner', text: l('Wer pflegt Preise und Rabatte heute? Soll diese Person das in der App tun oder soll die App vorhandene Preise übernehmen?', 'Кто сейчас меняет цены и скидки? Этот человек будет делать это в приложении или приложение забирает существующие цены?') },
      { id: 'missing-price', text: l('Darf der Rapport bei fehlendem Preis trotzdem rausgehen? Wer darf einen Sonderpreis einsetzen oder einen berechneten Preis ändern?', 'Можно ли отправить рапорт без цены? Кто может установить особую цену или изменить рассчитанную?') }
    ]
  },
  {
    id: 'report-policy', phase: l('Übergaben', 'Передача'), topicId: 'raport',
    title: l('Rapportweg mit Isa festlegen', 'Согласовать с Исой путь рапорта'),
    situation: l('Vor dem ersten echten Rapport muss geklärt sein, wer prüft, wer sendet und ob eine Freigabe zwingend ist.', 'До первого настоящего рапорта нужно определить, кто проверяет, кто отправляет и обязательно ли согласование.'),
    action: l('Der Admin dokumentiert den vereinbarten Versandweg und richtet nur die bestätigten Rechte ein. Rapportversand, Kundenantwort und Stundenfreigabe werden einzeln geklärt.', 'Администратор фиксирует согласованный маршрут и выдаёт только подтверждённые права. Отдельно уточняются отправка рапорта, ответ клиента и согласование часов.'),
    system: l('Zwei Varianten für das Gespräch: Arbeiter → Kunde; oder Arbeiter → Vorarbeiter → Kunde. Bis zur Entscheidung wird keine Variante als verbindlicher Prozess ausgegeben.', 'Для обсуждения есть два варианта: рабочий → клиент; либо рабочий → прораб → клиент. До решения ни один не объявляется обязательным.'),
    handover: l('Arbeiter und Vorarbeiter erfahren, wer den nächsten Schritt übernimmt. Die externe Kundenantwort ist im bestehenden Prozess separat durchgehbar.', 'Рабочий и прораб знают, кто выполняет следующий шаг. Ответ внешнего клиента можно отдельно разобрать в существующей карте процесса.'),
    targetRole: 'foreman', processStepId: 'customer',
    exceptions: l('Vorarbeiter fehlt, Kunde lehnt ab oder antwortet nicht: einen konkreten Ersatz- und Korrekturweg festlegen. Daraus folgt keine automatische Sperre des Stundenexports.', 'Нет прораба, клиент отказал или не ответил: определить замену и порядок исправлений. Это не означает автоматическую блокировку передачи часов.'),
    basis: l('Quellenkonflikt: Das Gespräch nennt direkten Versand durch den Arbeiter; der Team-Entwurf nennt Prüfung und Weiterleitung durch den Vorarbeiter oder Verantwortlichen.', 'Расхождение источников: разговор описывает прямую отправку рабочим; командный черновик — проверку и отправку прорабом или ответственным.'),
    source: interviewSource + ' · ' + teamSource + ' · Nutzerfrage 11.10.2026',
    questions: [
      { id: 'sender', text: l('Schickt der Arbeiter den Rapport direkt an den Kunden oder zuerst an den Vorarbeiter? Ist dessen Freigabe Pflicht, und wer drückt danach auf Senden?', 'Рабочий отправляет рапорт прямо клиенту или сначала прорабу? Обязательно ли одобрение прораба и кто после этого нажимает «Отправить»?'), previousAnswer: l('Gespräch: Arbeiter sendet direkt. Team-Entwurf: Vorarbeiter prüft und sendet selbst oder lässt den Verantwortlichen senden. Isa muss den Widerspruch auflösen.', 'Разговор: рабочий отправляет напрямую. Командный черновик: прораб проверяет и отправляет сам либо поручает ответственному. Иса должен уточнить.'), provenance: 'interview' },
      { id: 'customer-wait', text: l('Müssen Stunden auf Kundenbestätigung warten? Was passiert mit Stunden und Rapport, wenn der Kunde nicht antwortet oder widerspricht?', 'Нужно ли ждать подтверждения клиента перед передачей часов? Что происходит с часами и рапортом, если клиент молчит или возражает?') },
      { id: 'foreman-replacement', text: l('Wenn Vorarbeiterfreigabe nötig ist: Wer darf bei seiner Abwesenheit freigeben und senden?', 'Если согласование прораба обязательно: кто может согласовать и отправить в его отсутствие?') }
    ]
  },
  {
    id: 'monitor', phase: l('Laufender Betrieb', 'Текущая работа'), topicId: 'api',
    title: l('Offene Vorgänge im Blick behalten', 'Следить за незавершёнными действиями'),
    situation: l('Die Mannschaft arbeitet. Der Admin braucht eine Übersicht über offene Einladungen, fehlende Daten und gescheiterte Übertragungen.', 'Бригада работает. Администратору нужен обзор непринятых приглашений, недостающих данных и ошибок передачи.'),
    action: l('Der Admin schaut auf Ausnahmen: fehlende Zuordnungen, ausstehende Synchronisierung und Tripletex-Fehler. Er gibt den Fall an die zuständige Person weiter.', 'Администратор проверяет исключения: нет привязки, ожидается синхронизация или произошла ошибка Tripletex. Передаёт случай ответственному.'),
    system: l('Status klar unterscheiden: lokal erfasst, Übertragung ausstehend, erfolgreich übertragen, Prüfung offen. Ein fehlender Upload ist kein Beweis, dass nicht gearbeitet wurde.', 'Различать статусы: записано локально, ожидает передачи, передано, ожидает проверки. Отсутствие загрузки не доказывает отсутствие работы.'),
    handover: l('Arbeiter klären Erfassungslücken; Vorarbeiter prüfen fachliche Abweichungen und die Stunden in Tripletex. Der Admin koordiniert die Behebung.', 'Рабочие уточняют пропуски записей; прорабы проверяют расхождения и часы в Tripletex. Администратор координирует исправление.'),
    targetRole: 'foreman', processStepId: 'export',
    exceptions: l('Kein Internet auf der Baustelle: letzte erfolgreiche Übertragung zeigen und auf Nachsynchronisierung warten. Ob und wann jemand eine Warnung erhält, wird mit Isa festgelegt.', 'На объекте нет интернета: показать последнюю успешную передачу и ожидать синхронизации. Когда и кому отправлять предупреждение, определяет Иса.'),
    basis: l('Übersicht über Baustellen und Mitarbeiterarbeiten stammt aus dem Team-Entwurf. Die genaue Admin-Ansicht und Warnschwellen sind neue Vorschläge.', 'Обзор объектов и работ сотрудников предложен командой. Конкретный экран администратора и условия предупреждений — новые предложения.'),
    source: teamSource + ' · ' + interviewSource,
    questions: [
      { id: 'dashboard', text: l('Was musst du als Admin täglich sehen: offene Rapporte, fehlende Stunden, Baustellenstatus oder nur Fehler? Für alle Baustellen oder nur eigene?', 'Что администратор должен видеть каждый день: открытые рапорты, недостающие часы, состояние объектов или только ошибки? По всем объектам или только своим?') },
      { id: 'alert', text: l('Wen informieren wir bei fehlender Synchronisierung oder Tripletex-Fehlern, und nach welcher Wartezeit?', 'Кому сообщаем о задержке синхронизации или ошибке Tripletex и через какое время?') }
    ]
  },
  {
    id: 'correction', phase: l('Laufender Betrieb', 'Текущая работа'), topicId: 'vremya',
    title: l('Fehler und Korrekturen bearbeiten', 'Обработать ошибки и исправления'),
    situation: l('Eine Zeitbuchung, ein Rapport, ein Preis oder eine Projektzuordnung ist falsch; Daten könnten schon versandt oder genehmigt sein.', 'Ошибочны часы, рапорт, цена или привязка к проекту; данные уже могли быть отправлены или согласованы.'),
    action: l('Der Admin erkennt den Zustand und leitet die Korrektur an den Berechtigten weiter. Bereits versandte Rapporte und genehmigte Stunden werden mit Grund und nachvollziehbarer Änderung behandelt.', 'Администратор определяет состояние записи и передаёт исправление уполномоченному. Отправленные рапорты и согласованные часы изменяются с указанием причины и истории.'),
    system: l('Vorheriger Wert, Korrekturgrund und Bearbeiter bleiben nachvollziehbar. Wiederholen einer fehlgeschlagenen Übertragung soll dieselben Stunden nicht doppelt anlegen.', 'Сохраняются исходное значение, причина и автор исправления. Повтор передачи не должен создавать дубли часов.'),
    handover: l('Vorarbeiter beziehungsweise Buchhaltung klären Stunden in Tripletex. Der Kunde erhält bei einer nötigen Rapportkorrektur eine klar erkennbare neue Version.', 'Прораб или бухгалтерия уточняют часы в Tripletex. При исправлении рапорта клиент получает явно обозначенную новую версию.'),
    targetRole: 'foreman', processStepId: 'approval',
    exceptions: l('Widersprüchliche Änderungen oder bereits abgeschlossener Lohnlauf: nicht still überschreiben. Zuständige Person entscheidet; offline eingereichte Korrekturen benötigen später eine Prüfung.', 'Конфликт изменений или зарплата уже оформлена: не перезаписывать незаметно. Решает уполномоченный; оффлайн исправления проверяются после синхронизации.'),
    basis: l('Stundenprüfung in Tripletex ist Gesprächsgrundlage. Wer wann korrigieren darf und wie Änderungen zurückkommen, ist offen.', 'Проверка часов в Tripletex описана в разговоре. Кто и когда исправляет записи и как возвращаются изменения, ещё нужно уточнить.'),
    source: interviewSource,
    questions: [
      { id: 'time-editor', text: l('Wer darf vergessene oder falsche Stunden ändern: Arbeiter, Vorarbeiter oder Admin? Was gilt nach Freigabe in Tripletex?', 'Кто исправляет забытые или неверные часы: рабочий, прораб или администратор? Что меняется после согласования в Tripletex?') },
      { id: 'report-editor', text: l('Wer darf einen bereits gesendeten oder unterschriebenen Rapport korrigieren? Muss der Kunde die neue Version erneut bestätigen?', 'Кто может исправить уже отправленный или подписанный рапорт? Должен ли клиент снова подтвердить новую версию?') },
      { id: 'error-owner', text: l('Wer übernimmt falsche Projektzuordnungen und fehlgeschlagene Tripletex-Übertragungen? Wer gibt den erneuten Versand frei?', 'Кто исправляет неверную привязку к объекту и ошибки передачи Tripletex? Кто разрешает повторную отправку?') }
    ]
  },
  {
    id: 'closure', phase: l('Abschluss', 'Завершение'), topicId: 'users',
    title: l('Baustelle abschließen und Zugang beenden', 'Закрыть объект и отключить доступ'),
    situation: l('Eine Baustelle ist fertig, ein Mitarbeiter verlässt die Firma oder die Admin-Verantwortung wechselt.', 'Объект завершён, сотрудник уходит из компании или меняется администратор.'),
    action: l('Der Admin prüft offene Zeiten, Rapporte, Uploads und Übergaben. Er archiviert die Baustelle beziehungsweise deaktiviert den Zugang und übergibt Verantwortlichkeiten.', 'Администратор проверяет незавершённые часы, рапорты, загрузки и передачи. Архивирует объект либо отключает доступ и передаёт обязанности.'),
    system: l('Archivierte Baustellen bleiben für die vereinbarten Nachweise auffindbar. Neue Arbeit wird nicht versehentlich auf ihnen erfasst; Zugangssperre und Datenaufbewahrung sind getrennte Vorgänge.', 'Архивные объекты остаются доступны для согласованных подтверждений. На них случайно не записывается новая работа; блокировка доступа и хранение данных — разные действия.'),
    handover: l('Vorarbeiter und Buchhaltung übernehmen offene Vorgänge. Bei Admin-Wechsel erhält der Nachfolger die Übersicht und einen funktionsfähigen Zugang.', 'Прораб и бухгалтерия принимают незавершённые случаи. При смене администратора преемник получает обзор и рабочий доступ.'),
    targetRole: 'foreman',
    exceptions: l('Sofort nötige Zugangssperre und noch nicht synchronisierte Daten: Sperre durchführen und die Daten kontrolliert sichern. Archiviertes Projekt nur mit vereinbartem Recht wieder öffnen.', 'Нужна немедленная блокировка, но есть несинхронизированные данные: отключить доступ и отдельно сохранить данные. Архивный объект открывается только с согласованным правом.'),
    basis: l('Archivierung, Deaktivierung und Übergabe sind Vorschläge für einen vollständigen Lebenszyklus. Befugnisse und Aufbewahrungsregeln muss Isa klären.', 'Архивирование, отключение и передача предложены для полного жизненного цикла. Права и правила хранения должен уточнить Иса.'),
    source: 'Workshop-Vorschlag 11.10.2026 · ' + teamSource,
    questions: [
      { id: 'close-site', text: l('Wer erklärt eine Baustelle für abgeschlossen? Müssen alle Rapporte bestätigt und Stunden übertragen sein, oder dürfen offene Fälle bleiben?', 'Кто объявляет объект закрытым? Все рапорты должны быть подтверждены и часы переданы или допускаются незавершённые случаи?') },
      { id: 'disable-user', text: l('Wer sperrt den Zugang bei Austritt oder verlorenem Handy? Was passiert mit noch nicht übertragenen Stunden und Fotos?', 'Кто блокирует доступ при увольнении или потере телефона? Что делать с ещё не переданными часами и фотографиями?') },
      { id: 'retention', text: l('Wer darf archivierte Baustellen und alte Rapporte einsehen oder wieder öffnen? Welche Aufbewahrungsregeln gelten bei euch?', 'Кто может просматривать или открывать архивные объекты и старые рапорты? Какие правила хранения действуют у вас?') }
    ]
  }
];

export const ROLE_JOURNEYS: RoleJourney[] = [
  {
    id: 'worker', name: l('Arbeiter', 'Рабочий'),
    purpose: l('Zugang erhalten, arbeiten, Zeiten und Leistungen erfassen, Rapport übergeben.', 'Получить доступ, работать, записывать часы и объёмы, передать рапорт.'),
    boundary: l('Der bestehende Baustellenprozess ist verknüpft. Der vollständige Rollenablauf ab Einladung wird als nächster Teil ausgearbeitet.', 'Существующий процесс работы на объекте связан с ролью. Полный путь от приглашения будет проработан следующим.'),
    steps: [], processStepIds: ['arrival', 'time', 'work', 'pricing', 'send', 'customer']
  },
  {
    id: 'foreman', name: l('Vorarbeiter', 'Прораб'),
    purpose: l('Baustelle und Mannschaft übernehmen, Abweichungen klären, Stunden prüfen.', 'Принять объект и бригаду, уточнить расхождения, проверить часы.'),
    boundary: l('Stundenprüfung in Tripletex ist die Gesprächsgrundlage. Zusätzliche Aufgaben und Rapportfreigabe sind noch zu klären.', 'Проверка часов в Tripletex описана в разговоре. Дополнительные задачи и согласование рапорта нужно уточнить.'),
    steps: [], processStepIds: ['approval', 'export', 'send', 'customer', 'accounting']
  },
  {
    id: 'admin', name: l('Admin', 'Администратор'),
    purpose: l('Firma, Zugänge und Baustellen vorbereiten; Zuständigkeiten und offene Vorgänge zusammenhalten.', 'Подготовить компанию, доступ и объекты; координировать ответственность и незавершённые случаи.'),
    boundary: l('Admin bedeutet nicht automatisch Rapport- oder Stundenfreigabe. Isa entscheidet die Befugnisse. Dieser Ablauf ist ein Vorschlag zum Durchgehen.', 'Администратор не получает автоматически право согласовать рапорты или часы. Права определяет Иса. Этот путь предложен для обсуждения.'),
    steps: ADMIN_JOURNEY_STEPS, processStepIds: []
  }
];

export function journeyQuestionKey(role: JourneyRoleId, stepId: string, questionId: string): string {
  return `role:${role}:${stepId}:${questionId}`;
}
