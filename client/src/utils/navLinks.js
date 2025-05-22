const encode = (str) => encodeURIComponent(str);

const navLinks = [
    {
        label: "ПЕРИЛНИ ПРЕПАРАТИ",
        href: `/catalog?category=${encode("ПЕРИЛНИ ПРЕПАРАТИ")}`,
        subLinks: [
            "ПРАХ ЗА ПРАНЕ",
            "ПРАХОВЕ ЗА БЕБЕТА",
            "КАПСУЛИ ЗА ПРАНЕ",
            "ОМЕКОТИТЕЛИ",
            "ЗА ПЕТНА",
            "ТЕЧНИ ПЕРИЛНИ ПРЕПАРАТИ",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("ПЕРИЛНИ ПРЕПАРАТИ")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "ПОЧИСТВАЩИ ПРЕПАРАТИ",
        href: `/catalog?category=${encode("ПОЧИСТВАЩИ ПРЕПАРАТИ")}`,
        subLinks: [
            "ПРЕПАРАТИ ЗА БАНЯ",
            "ЗА СЪДОМИЯЛНА",
            "ПРЕПАРАТИ ЗА МЕБЕЛИ",
            "ПРЕПАРАТИ ЗА СЪДОВЕ",
            "ПРЕПАРАТИ ЗА ПОДОВИ ПОВЪРХНОСТИ",
            "ПРЕПАРАТИ ЗА СТЪКЛА",
            "ПРЕПАРАТИ ЗА ОБЩО ПОЧИСТВАНЕ",
            "ПРЕПАРАТИ ЗА КУХНЯ",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("ПОЧИСТВАЩИ ПРЕПАРАТИ")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "ХИГИЕНА",
        href: `/catalog?category=${encode("ХИГИЕНА")}`,
        subLinks: [
            "ГЪБИ И КЪРПИ",
            "АРОМАТИЗАТОРИ",
            "МОП-ПОДОЧИСТАЧКИ-КОФИ",
            "АРОМАТИЗАТОРИ ЗА ТОАЛЕТНА",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("ХИГИЕНА")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "КОЗМЕТИКА",
        href: `/catalog?category=${encode("КОЗМЕТИКА")}`,
        subLinks: [
            "ЗА ЛИЦЕ И ТЯЛО",
            "ДУШ ГЕЛ",
            "ДЕЗОДОРАНТИ",
            "ЗА КОСАТА",
            "ЛАК И ПЯНА ЗА КОСА",
            "БОЯ И ТОНЕР ЗА КОСА",
            "ПРОДУКТИ ЗА БРЪСНЕНЕ",
            "ДАМСКИ ПРЕВРЪЗКИ",
            "ТОАЛЕТНИ САПУНИ",
            "ТЕЧНИ САПУНИ",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("КОЗМЕТИКА")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "БЕБЕТА И ДЕЦА",
        href: `/catalog?category=${encode("БЕБЕТА И ДЕЦА")}`,
        subLinks: [
            "КОЗМЕТИКА",
            "ПЕЛЕНИ И ГАЩИ",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("БЕБЕТА И ДЕЦА")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "ХАРТИЯ",
        href: `/catalog?category=${encode("ХАРТИЯ")}`,
        subLinks: [
            "ТОАЛЕТНА ХАРТИЯ",
            "КУХНЕНСКА РОЛКА",
            "САЛФЕТКИ",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("ХАРТИЯ")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "УСТНА ХИГИЕНА",
        href: `/catalog?category=${encode("УСТНА ХИГИЕНА")}`,
        subLinks: [
            "ПАСТИ ЗА ЗЪБИ",
            "ЧЕТКИ ЗА ЗЪБИ",
            "ВОДА ЗА УСТА",
        ].map((sublabel) => ({
            label: sublabel,
            href: `/catalog?category=${encode("УСТНА ХИГИЕНА")}&subCategory=${encode(sublabel)}`,
        })),
    },
    {
        label: "ДРУГИ",
        href: `/catalog?category=${encode("ДРУГИ")}`,
    },
    {
        label: "ВСИЧКИ",
        href: `/catalog`,
    },
];

export default navLinks;