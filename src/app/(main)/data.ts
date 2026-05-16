export const PLANTILLAS: Record<string, any> = {
  Amor:        { c:'amor',        i:'fa-heart',              k:'Romántico',   x:'#ff6b8a', e:'💕', b:'linear-gradient(135deg,#ff6b8a,#ffb3c1,#fff0f3)',  d:'Perfecta para declaraciones de amor y San Valentín',                    ej:'Eres mi todo, mi razón de sonreír cada día 💕' },
  Amistad:     { c:'amistad',     i:'fa-user-group',         k:'Amistad',     x:'#6b8aff', e:'💙', b:'linear-gradient(135deg,#6b8aff,#b3c1ff,#f0f3ff)',  d:'Celebra la amistad verdadera con mensajes del corazón',                 ej:'Gracias por estar siempre, por las risas y por ser mi mejor amigo 💙' },
  Aniversario: { c:'aniversario', i:'fa-calendar-heart',     k:'Celebración', x:'#ffd700', e:'🥂', b:'linear-gradient(135deg,#ffd700,#ffed4e,#fff9db)',  d:'Celebra meses o años juntos con una dedicatoria inolvidable',           ej:'Un año más a tu lado, mil sonrisas compartidas 🥂' },
  Carta:       { c:'carta',       i:'fa-envelope-open-text', k:'Romántico',   x:'#d4a574', e:'✉️', b:'linear-gradient(135deg,#d4a574,#e8c9a0,#faf0e6)',  d:'Una carta de amor digital elegante y nostálgica',                       ej:'Querido amor, escribo estas líneas para recordarte lo mucho que significas ✉️' },
  Declaracion: { c:'declaracion', i:'fa-hand-holding-heart', k:'Romántico',   x:'#e74c3c', e:'❤️', b:'linear-gradient(135deg,#e74c3c,#ff8a80,#fce4e4)',  d:'Declara tu amor con un mensaje valiente y emotivo',                     ej:'No sabía que el amor verdadero existía hasta que te conocí ❤️' },
  Saludo:      { c:'saludo',      i:'fa-sun',                k:'Amistad',     x:'#ff9a3c', e:'🌅', b:'linear-gradient(135deg,#ff9a3c,#ffcc02,#fff8e1)',  d:'Buenos días, buenas noches o saludos especiales',                       ej:'Buenos días sol, que tu día esté lleno de sonrisas y bendiciones 🌅' },
  Mujer:       { c:'mujer',       i:'fa-venus',              k:'Celebración', x:'#8B5CF6', e:'💜', b:'linear-gradient(135deg,#8B5CF6,#C084FC,#F3E8FF)',  d:'Celebra el Día de la Mujer con un mensaje especial y personalizado',    ej:'Tu fuerza, tu luz y tu valentía inspiran al mundo entero 💜' },
  Mujer1:      { c:'mujer1',      i:'fa-venus',              k:'Celebración', x:'#ff3849', e:'👸', b:'linear-gradient(135deg,#ff3849,#ff7a85,#ffccd1)',  d:'Día de la Mujer con estilo rosa vibrante',                              ej:'Eres luz, fuerza e inspiración. Feliz día 🩷' },
};

export const EJEMPLOS: Record<string, any[]> = {
  Amor: [
    { de: 'Carlos', para: 'Maria', msg: 'Cada dia a tu lado es un regalo que atesoro. Eres la razon de mi sonrisa mas sincera' },
    { de: 'Sofia', para: 'Daniel', msg: 'No sabia que existia un amor asi hasta que te encontre. Gracias por hacerme tan feliz' },
    { de: 'Andres', para: 'Valentina', msg: 'Eres mi persona favorita en este mundo. Te amo mas de lo que las palabras pueden expresar' },
    { de: 'Luna', para: 'Mateo', msg: 'Contigo aprendi que el amor verdadero no se busca, simplemente llega y lo cambia todo' }
  ],
  Amistad: [
    { de: 'Ana', para: 'Lucia', msg: 'Gracias por ser la amiga que todos quisieran tener. Nuestra amistad dura para siempre' },
    { de: 'Pedro', para: 'Juan', msg: 'Hermano de otra madre. Gracias por las risas, los consejos y por bancarte mis locuras' },
    { de: 'Camila', para: 'Renata', msg: 'No importa la distancia ni el tiempo, nuestra amistad siempre sera especial' },
    { de: 'Diego', para: 'Tomas', msg: 'Los mejores recuerdos de mi vida los tengo contigo. Gracias por ser un amigo increible' }
  ],
  Aniversario: [
    { de: 'Roberto', para: 'Elena', msg: 'Un anio mas juntos y cada dia te elijo de nuevo. Feliz aniversario mi amor' },
    { de: 'Mariana', para: 'Sebastian', msg: '365 dias mas de risas, aventuras y amor infinito. Que vengan muchos mas' },
    { de: 'Felipe', para: 'Isabella', msg: 'Hoy celebro el mejor dia de mi vida: el dia que decidimos estar juntos' },
    { de: 'Valeria', para: 'Nicolas', msg: 'Cada mes a tu lado es un capitulo hermoso. Feliz aniversario amor mio' }
  ],
  Carta: [
    { de: 'Gabriel', para: 'Alejandra', msg: 'Querida mia, escribo estas lineas porque hay sentimientos que necesitan mas que una simple frase' },
    { de: 'Fernanda', para: 'Miguel', msg: 'Mi querido Miguel, esta carta lleva guardada todo lo que mi corazon siente por ti' },
    { de: 'Joaquin', para: 'Paulina', msg: 'Cada palabra de esta carta lleva un pedazo de mi alma. Ojala puedas sentir todo lo que siento' },
    { de: 'Clara', para: 'Emilio', msg: 'Querido Emilio, si pudiera escribir todo lo que significas necesitaria un libro entero' }
  ],
  Declaracion: [
    { de: 'Martin', para: 'Catalina', msg: 'Llevaba tiempo queriendo decirte esto: me gustas mucho. Me darias la oportunidad de hacerte feliz?' },
    { de: 'Isabela', para: 'Rodrigo', msg: 'No puedo seguir callando lo que siento. Cada vez que te veo mi corazon se acelera. Me encantas' },
    { de: 'Tomas', para: 'Daniela', msg: 'Se que es un mensaje, pero es el mas sincero que he escrito. Me enamore de ti' },
    { de: 'Camila', para: 'Santiago', msg: 'Hoy decidi ser valiente y decirte lo que siento. Eres la persona mas especial que he conocido' }
  ],
  Saludo: [
    { de: 'Amor', para: 'Sol', msg: 'Buenos dias hermosa, que tu dia este lleno de sonrisas y bendiciones. Mereces lo mejor del mundo' },
    { de: 'Tu amiga', para: 'Estrella', msg: 'Buenas noches amiga, descansa bonito. Maniana sera un dia increible, lo presiento' },
    { de: 'Mama', para: 'Hijita', msg: 'Buenos dias mi amor, recuerda que eres fuerte, valiente y capaz de lograr todo lo que te propongas' },
    { de: 'Tu novio', para: 'Princesa', msg: 'Buenas noches mi vida, que suenies con cosas bonitas. Te mando un abrazo enorme' }
  ]
};

export const getCategorias = () => [...new Set(Object.values(PLANTILLAS).map(p => p.k))];
export const getNombres = () => Object.keys(PLANTILLAS);
