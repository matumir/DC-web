const guantes = [
  {
    id: "guantes-1",
    nombre: "Guantes de nitrilo descartables",
    Descripcion: "Solo para riesgos mínimos contra: \nAcción mecánica cuyos riesgos sean aritificiales\nProductos de limpieza de acción débil y efectos fácilmente reversibles",
    Especificaciones: "No estéril y sin polvo.\nNo contiene látex natural.\nForma ambidiestra.\nCalidad económica.\nBorde de puño enrollado.\nAlta sensibilidad táctil y desteridad.\nDedos texturizados para mayor agarre.",
    Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/dps/nitrilo descartable.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Sintéticos",
    marca: "De Pascale",
    destacado: false,
    talles: ["S","M","L","XL"],
    colores: [
      { nombre: "Negro", imagenes: ["imagenes/Productos/guantes/sintéticos/nitrilodesc1.png","imagenes/Productos/guantes/sintéticos/nitrilodesc2.png"] }
    ]
  },
  {
    id: "guantes-2",
    nombre: "Guante de acrilo nitrilo verde flocado largo",
    Descripcion: "Posee protección contra riesgos mecánicos y químicos.\nExcelente nivel de desteridad y confort.\nDiseño de la superficie de palma con terminación grip para mejor sujeción de objetos.",
    Especificaciones: "* Manipuleo de ácidos.\nManipuleo de bases.\nManipuleo de solventes.\nIndustria Química en General.\nEl guante ha sido probado con los siguientes productos químicos, obteniendo los siguientes niveles de penetración \n\nAcetona Clase 1\n: Hidróxido de Sodio Clase 1\n: Ácido Sulfúrico Clase 1\nTiempo medio de penetración: > 10 minutos.",
     Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/dps/acrilo nitrilo verde flocado.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Sintéticos",
    marca: "De Pascale",
    destacado: false,
    talles: [7,8,9,10,11],
    colores: [
      { nombre: "Verde", imagenes: ["imagenes/Productos/guantes/sintéticos/acrilonitv1.png","imagenes/Productos/guantes/sintéticos/acrilonitv2.png"] }
    ]
  },
  {
    id: "guantes-3",
    nombre: "Guante de látex uso industrial",
    Descripcion: "Solados de cerámica y porcelanato\nPreparación de mezclas de cemento y otros\nTareas de albañilería en general",
    Especificaciones: "Producto certificado: Norma IRAM 3607, IRAM 3608.\nProtección contra riesgos mecánicos.\nEspesor de 0.6 mm.\nAlto nivel de flexibilidad y confort.",
    Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/dps/latexindustrial.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Sintéticos",
    marca: "De Pascale",
    destacado: false,
    talles: [9,10],
    colores: [
      { nombre: "Negro", imagenes: ["imagenes/Productos/guantes/sintéticos/latexind1.png","imagenes/Productos/guantes/sintéticos/latexind2.png"] }
    ]
  },
  {
    id: "guantes-4",
    nombre: "Guante de acrilo nitrilo flocado verde",
    Descripcion: "Este guante ha sido diseñado para que el usuario pueda realizar su trabajo normalmente y no le produzca molestias que se opongan a la realización del trabajo. El guante está concebido y fabricado de tal manera, que cuando se usa conforme a las instrucciones del fabricante no ocasiona riesgos ni otros factores de molestia. Los materiales utilizados para la fabricación del guante no producen efectos nocivos para la salud del usuario.",
    Especificaciones: "Grados de Protección según Norma IRAM 3607, IRAM 3608, IRAM 3609.\nResistencia a la abrasión: Nivel 2.\nResistencia al corte por cuchilla: Nivel 1.\nResistencia al desgarre: Nivel 0.\nResistencia a la perforación: Nivel 2.\nResistencia química baja y guantes impermeables.\nProtección contra riesgos por microorganismos: los guantes son impermeables protegiendo al usuario contra los microorganismos.\nInocuidad garantizada: Diseñado para minimizar riesgos o molestias.\nMaterial seguro: Libre de sustancias perjudiciales.\nErgonomía: Adaptado para uso prolongado sin incomodidades.\npH Controlado: Conforme a la norma IRAM 3608, seguro para la piel.",
    Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/spi/acrilo nitrilo verde flocado.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Sintéticos",
    marca: "S.P.I SHIELD",
    destacado: false,
    talles: [7,8,9,10,11],
    colores: [
      { nombre: "Verde", imagenes: ["imagenes/Productos/guantes/sintéticos/acrilonv1.webp","imagenes/Productos/guantes/sintéticos/acrilonv2.webp"] }
    ]
  },
  {
    id: "guantes-5",
    nombre: "Guante descarne ",
    Descripcion: "Descarne amarillo americano puño corto de algodón tejido con refuerzo.",
    Especificaciones: "Puño: Americano. \n Refuerzo: En palma.",
    Documentacion: [
    { nombre: "Ficha técnica no disponible" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "BELLAZZI",
    destacado: false,
    talles: ["ÚNICO"],
    colores: [
      { nombre: "Amarillo", imagenes: ["imagenes/Productos/guantes/cuero/descarne.png"] }
    ]
  },
  {
    id: "guantes-6",
    nombre: "Guante soldador forrado",
    Descripcion: "Guante descarne Forrado para soldador rojo.",
    Especificaciones: "Puño: Largo. \n Material: Descarne.",
    Documentacion: [
    { nombre: "Ficha técnica no disponible" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "BELLAZZI",
    destacado: false,
    talles: ["ÚNICO"],
    colores: [
      { nombre: "Rojo", imagenes: ["imagenes/Productos/guantes/cuero/soldador.png"] }
    ]
  },
  {
    id: "guantes-7",
    nombre: "Guante vaqueta 1/2 paseo",
    Descripcion: "Guante vaqueta amarilla medio paseo.",
    Especificaciones: "Puño: Elastizado. \n Material: Vaqueta.",
    Documentacion: [
    { nombre: "Ficha técnica no disponible" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "BELLAZZI",
    destacado: false,
    talles: [8,9,10,11],
    colores: [
      { nombre: "Amarillo", imagenes: ["imagenes/Productos/guantes/cuero/vaquetamedio.png"] }
    ]
  },
  {
    id: "guantes-8",
    nombre: "Guante vaqueta combinado c/ descarne",
    Descripcion: "Guante vaqueta amarilla americano combinado con descarne puño corto con refuerzo",
    Especificaciones: "Puño: Americano. \n Material: Vaqueta c/ descarne",
    Documentacion: [
    { nombre: "Ficha técnica no disponible" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "BELLAZZI",
    destacado: false,
    talles: ["ÚNICO"],
    colores: [
      { nombre: "Amarillo", imagenes: ["imagenes/Productos/guantes/cuero/vaquetacomb.png"] }
    ]
  },
  {
    id: "guantes-9",
    nombre: "Guante vaqueta cubre dieléctrico",
    Descripcion: "Guante vaqueta amarilla cubre DIELECTRICO",
    Especificaciones: "Puño: Largo. \n Material: Vaqueta (apto dieléctrico)",
    Documentacion: [
    { nombre: "Ficha técnica no disponible" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "BELLAZZI",
    destacado: false,
    talles: ["ÚNICO"],
    colores: [
      { nombre: "Amarillo", imagenes: ["imagenes/Productos/guantes/cuero/vaquetadiel.png"] }
    ]
  },
  {
    id: "guantes-10",
    nombre: "Guante descarne",
    Descripcion: "Tareas de Mantenimiento.\nMetalmecánicas.\nPetróleo.\n Petroquímica.",
    Especificaciones: "Puño: Corto. \n Material: Descarne \nRefuerzo: Simple\nProducto certificado: Norma IRAM 3607-3608. ",
    Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/dps/descarne.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Cuero",
    marca: "DE PASCALE",
    destacado: false,
    talles: ["ÚNICO"],
    colores: [
      { nombre: "Gris", imagenes: ["imagenes/Productos/guantes/cuero/descarnedep1.png","imagenes/Productos/guantes/cuero/descarnedep2.png","imagenes/Productos/guantes/cuero/descarnedep3.png"] }
    ]
  },
  {
    id: "guantes-11",
    nombre: "Guante Tejido S/Costura G7 Anticorte",
    Descripcion: "Equipo de protección personal que protege la mano o una parte de ella contra riesgos mecánicos.\nConstruido con hilado de HPPE, fibra de polietileno de alto rendimiento, tiene una resistencia a la tensión 15 veces superior a la del acero (sobre una base peso por peso), compuesto de UHMWPE, Spandex y Nylon que asegura niveles de protección al corte máximos.\nEsta fibra resistente a los cortes se puede lavar y volver a usar sin que se vea afectada su capacidad de protección. Esto aumenta considerablemente la vida útil de los guantes a la vez que reduce apreciablemente el costo. HPPE es extremadamente resistente a la abrasión, la humedad, los rayos UV y los productos químicos. La fibra HPPE es muy suave y se adapta a la temperatura de la piel. Esto minimiza la sudoración puesto que transfiere la humedad al exterior del guante.",
    Especificaciones: "Material: Tejido anticorte.",
    Documentacion: [
    { nombre: "Ficha técnica", url: "fichas/guantes/dps/tejido anticorte g7.pdf" }
    ],
    categoria: "Guantes",
    subcategoria: "Anti corte",
    marca: "DE PASCALE",
    destacado: false,
    talles: [9,10],
    colores: [
      { nombre: "Blanco", imagenes: ["imagenes/Productos/guantes/anticorte/tejidog71.png","imagenes/Productos/guantes/anticorte/tejidog72.png"] }
    ]
  }
];
