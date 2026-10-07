export interface KanaStrokeInfo {
  strokes: number;
  tips: string;
  steps: string[];
}

export const HIRAGANA_STROKE_DATA: Record<string, KanaStrokeInfo> = {
  // A-Row
  'あ': {
    strokes: 3,
    tips: 'Garis datar atas, vertikal sedikit melengkung, lalu putaran besar dari tengah ke kanan.',
    steps: [
      'Garis mendatar dari kiri ke kanan di bagian atas',
      'Garis vertikal melengkung sedikit memotong garis pertama',
      'Mulai dari tengah, buat loop melingkar lebar ke kanan bawah',
    ],
  },
  'い': {
    strokes: 2,
    tips: 'Garis kiri melengkung dengan kait (hane) di ujung, lalu garis kanan lebih pendek.',
    steps: [
      'Garis lengkung di kiri, akhiri dengan kait kecil ke kanan atas',
      'Garis lengkung di kanan, sedikit lebih pendek dan menurun',
    ],
  },
  'う': {
    strokes: 2,
    tips: 'Titik miring pendek di atas, disusul lengkungan besar seperti telinga.',
    steps: [
      'Garis miring pendek dari kiri atas ke kanan bawah',
      'Lengkungan besar melengkung ke kanan lalu membulat ke kiri bawah',
    ],
  },
  'え': {
    strokes: 2,
    tips: 'Titik miring atas, lalu garis zig-zag mirip angka 7 bersambung gelombang datar.',
    steps: [
      'Titik miring pendek di bagian atas',
      'Tarik garis diagonal, turun ke kiri, lalu buat gelombang mendatar di dasar',
    ],
  },
  'お': {
    strokes: 3,
    tips: 'Garis datar, garis vertikal berloop memutar ke kanan, lalu titik di kanan atas.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis vertikal turun, berputar membuat loop ke kanan hingga melingkar',
      'Titik miring pendek di sebelah kanan atas',
    ],
  },

  // K-Row
  'か': {
    strokes: 3,
    tips: 'Garis sudut dengan kait, garis vertikal pemotong, lalu titik di kanan luar.',
    steps: [
      'Garis mendatar lalu belok turun melengkung dengan kait di ujungnya',
      'Garis melengkung sedikit memotong dari atas ke kiri bawah',
      'Titik miring di sebelah kanan luar',
    ],
  },
  'き': {
    strokes: 4,
    tips: 'Dua garis datar sejajar miring ke atas, garis miring menusuk, lalu lengkungan bawah.',
    steps: [
      'Garis mendatar atas, miring sedikit ke atas',
      'Garis mendatar kedua di bawahnya (sedikit lebih panjang)',
      'Garis miring menusuk dari atas ke kanan bawah, akhiri kait',
      'Lengkungan terpisah di bagian bawah menghadap ke kiri',
    ],
  },
  'く': {
    strokes: 1,
    tips: 'Satu tarikan tunggal membentuk sudut lancip mirip kurung siku buka (<).',
    steps: [
      'Tarik garis dari kanan atas miring ke kiri tengah, lalu belok tajam ke kanan bawah',
    ],
  },
  'け': {
    strokes: 3,
    tips: 'Garis vertikal kiri dengan kait, garis datar kanan, disusul garis vertikal kanan.',
    steps: [
      'Garis vertikal di kiri dengan kait kecil di bawah menghadap ke kanan',
      'Garis mendatar pendek di sisi kanan',
      'Garis melengkung vertikal memotong garis kedua hingga ke bawah',
    ],
  },
  'こ': {
    strokes: 2,
    tips: 'Garis mendatar atas dengan kait kecil, dan garis mendatar bawah melengkung naik.',
    steps: [
      'Garis mendatar atas dari kiri ke kanan dengan sedikit kait di ujung',
      'Garis mendatar bawah melengkung lembut ke atas',
    ],
  },

  // S-Row
  'さ': {
    strokes: 3,
    tips: 'Garis datar miring ke atas, garis pemotong dengan kait, lalu lengkungan bawah.',
    steps: [
      'Garis mendatar miring sedikit ke atas',
      'Garis miring melintang dari kanan atas menusuk ke kiri bawah berujung kait',
      'Lengkungan terpisah di bawah membulat ke kiri',
    ],
  },
  'し': {
    strokes: 1,
    tips: 'Satu tarikan vertikal turun lurus lalu melengkung ke kanan atas mirip kail pancing.',
    steps: [
      'Tarik garis dari atas lurus ke bawah, lalu melengkung halus ke kanan atas',
    ],
  },
  'す': {
    strokes: 2,
    tips: 'Garis mendatar panjang, garis vertikal menusuk membuat simpul lingkaran lalu melengkung.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis vertikal lurus ke bawah, buat simpul melingkar di tengah, lalu turun melengkung ke kiri',
    ],
  },
  'せ': {
    strokes: 3,
    tips: 'Garis mendatar panjang, garis vertikal kanan berkait, lalu garis vertikal kiri belok kanan.',
    steps: [
      'Garis mendatar panjang dari kiri ke kanan',
      'Garis vertikal di sebelah kanan dengan kait kecil ke kiri di bawah',
      'Garis vertikal di sisi kiri turun lalu membelok mendatar ke kanan',
    ],
  },
  'そ': {
    strokes: 1,
    tips: 'Satu tarikan kontinu membentuk huruf Z di atas lalu melengkung seperti huruf C terbalik di bawah.',
    steps: [
      'Tarik mendatar, serong ke kiri bawah, mendatar ke kanan, lalu lengkungan bulat ke kiri bawah',
    ],
  },

  // T-Row
  'た': {
    strokes: 4,
    tips: 'Garis datar, garis miring, lalu dua garis kecil membentuk seperti huruf こ di kanan.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis miring memotong dari atas ke kiri bawah',
      'Garis mendatar kecil di kanan atas',
      'Garis mendatar melengkung kecil di kanan bawah',
    ],
  },
  'ち': {
    strokes: 2,
    tips: 'Garis datar atas, disusul garis pemotong yang melengkung bulat mirip angka 5.',
    steps: [
      'Garis mendatar dari kiri ke kanan di bagian atas',
      'Garis miring memotong lalu langsung membentuk lengkungan setengah lingkaran besar ke bawah',
    ],
  },
  'つ': {
    strokes: 1,
    tips: 'Satu tarikan melengkung cembung besar ke atas lalu melandai halus ke kiri bawah mirip ombak.',
    steps: [
      'Tarik dari kiri bawah melengkung tinggi ke kanan atas, lalu meluncur melandai ke kiri bawah',
    ],
  },
  'て': {
    strokes: 1,
    tips: 'Satu tarikan mendatar lalu melengkung bulat besar ke kiri bawah mirip huruf C terbalik.',
    steps: [
      'Tarik garis mendatar ke kanan, lalu putar melengkung membulat ke kiri bawah',
    ],
  },
  'と': {
    strokes: 2,
    tips: 'Garis miring pendek di kiri atas, lalu garis melengkung memeluk dari atas ke bawah.',
    steps: [
      'Garis miring pendek dari atas ke arah kanan bawah',
      'Mulai dari atas garis pertama, buat lengkungan vertikal membulat ke kanan lalu ke dasar',
    ],
  },

  // N-Row
  'な': {
    strokes: 4,
    tips: 'Garis datar, garis miring menusuk, titik di kanan, lalu garis vertikal berloop.',
    steps: [
      'Garis mendatar di kiri atas',
      'Garis miring memotong dari atas ke kiri bawah',
      'Titik miring kecil di kanan atas',
      'Garis vertikal di kanan bawah berputar membuat loop kecil ke kiri',
    ],
  },
  'に': {
    strokes: 3,
    tips: 'Garis vertikal kiri dengan kait, lalu dua garis datar sejajar di kanan.',
    steps: [
      'Garis vertikal di sebelah kiri diakhiri kait kecil ke atas',
      'Garis mendatar pendek di kanan atas',
      'Garis mendatar di kanan bawah, sedikit melengkung',
    ],
  },
  'ぬ': {
    strokes: 2,
    tips: 'Garis miring ke kanan bawah, disusul garis lengkung memotong, berputar membuat loop di ujung.',
    steps: [
      'Garis miring dari kiri atas ke kanan bawah',
      'Garis melengkung dari atas memotong garis pertama, memutar membulat ke kanan dan diakhiri loop kecil',
    ],
  },
  'ね': {
    strokes: 2,
    tips: 'Garis vertikal lurus kiri, lalu garis zig-zag naik membuat busur dan loop simpul di ujung.',
    steps: [
      'Garis vertikal lurus dari atas ke bawah di sebelah kiri',
      'Garis zig-zag membentuk huruf Z, naik melengkung ke kanan, lalu turun berputar membuat simpul kecil',
    ],
  },
  'の': {
    strokes: 1,
    tips: 'Satu tarikan melengkung ke kiri bawah lalu melingkar besar membentuk spiral mirip lambang larangan.',
    steps: [
      'Tarik dari tengah miring ke kiri bawah, lalu putar melingkar besar ke kanan atas dan melingkari diri',
    ],
  },

  // H-Row
  'は': {
    strokes: 3,
    tips: 'Garis vertikal kiri berkait, garis datar kanan, lalu garis vertikal dengan loop simpul.',
    steps: [
      'Garis vertikal di sebelah kiri dengan kait kecil di bawah',
      'Garis mendatar pendek di sebelah kanan',
      'Garis vertikal memotong garis mendatar, turun lalu membuat loop simpul ke kiri',
    ],
  },
  'ひ': {
    strokes: 1,
    tips: 'Satu tarikan mendatar pendek, turun membentuk mangkuk U lebar, lalu meluncur ke kanan bawah.',
    steps: [
      'Mendatar pendek, turun membulat membentuk kurva U ke atas, lalu meluncur ke kanan bawah',
    ],
  },
  'ふ': {
    strokes: 4,
    tips: 'Titik atas, garis lengkung bergelombang di tengah, lalu titik kiri dan titik kanan.',
    steps: [
      'Titik miring di bagian atas tengah',
      'Garis tengah turun membentuk gelombang hidung melengkung ke kiri',
      'Titik miring di sebelah kiri bawah',
      'Titik miring di sebelah kanan bawah',
    ],
  },
  'へ': {
    strokes: 1,
    tips: 'Satu tarikan membentuk atap segitiga: naik pendek ke kanan atas lalu turun melandai panjang.',
    steps: [
      'Tarik miring naik ke kanan atas, lalu belok meluncur turun lebih panjang ke kanan bawah',
    ],
  },
  'ほ': {
    strokes: 4,
    tips: 'Mirip は tapi dengan garis datar atas tertutup dan dua garis horizontal.',
    steps: [
      'Garis vertikal di sisi kiri dengan kait di bawah',
      'Garis mendatar atas di sebelah kanan',
      'Garis mendatar kedua di bawahnya',
      'Garis vertikal memotong kedua garis datar, turun lalu membuat simpul loop di bawah',
    ],
  },

  // M-Row
  'ま': {
    strokes: 3,
    tips: 'Dua garis datar sejajar, garis vertikal menembus lalu membuat loop simpul di dasar.',
    steps: [
      'Garis mendatar atas dari kiri ke kanan',
      'Garis mendatar bawah sejajar (sedikit lebih pendek)',
      'Garis vertikal menusuk kedua garis datar lalu berputar membuat loop ke kiri di bawah',
    ],
  },
  'み': {
    strokes: 2,
    tips: 'Garis datar belok miring berloop lalu meluncur ke kanan, disusul garis pemotong melengkung.',
    steps: [
      'Garis mendatar miring, turun membuat simpul loop, lalu ditarik miring ke kanan bawah',
      'Garis miring melengkung memotong ekor garis pertama dari kanan atas ke bawah',
    ],
  },
  'む': {
    strokes: 3,
    tips: 'Garis datar, garis vertikal berloop memutar ke kanan atas dengan kait, lalu titik di kanan.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis vertikal turun membuat loop lingkaran, mendatar lalu melengkung naik dengan kait',
      'Titik miring di sebelah kanan atas',
    ],
  },
  'め': {
    strokes: 2,
    tips: 'Garis miring dari kiri ke kanan bawah, disusul lengkungan memotong dan memutar membulat.',
    steps: [
      'Garis miring sedikit melengkung dari kiri atas ke kanan bawah',
      'Mulai dari kanan atas, tarik melengkung memotong garis pertama lalu berputar membulat ke kanan dasar',
    ],
  },
  'も': {
    strokes: 3,
    tips: 'Tarik garis vertikal berbelok kait mirip huruf し, lalu tambahkan dua garis datar memotong.',
    steps: [
      'Garis vertikal lurus turun lalu melengkung membulat ke kanan atas mirip kail',
      'Garis mendatar pertama memotong di bagian atas',
      'Garis mendatar kedua sejajar di bawahnya',
    ],
  },

  // Y-Row
  'や': {
    strokes: 3,
    tips: 'Garis lengkung melingkar ke kanan, titik di atas, lalu garis miring pemotong lurus.',
    steps: [
      'Garis melengkung ke kanan atas lalu berbelok meluncur ke kiri bawah berujung kait',
      'Titik miring kecil di sebelah atas tengah',
      'Garis miring panjang menusuk memotong garis pertama dari atas ke kiri bawah',
    ],
  },
  'ゆ': {
    strokes: 2,
    tips: 'Garis vertikal turun memutar membulat ke atas dan bawah, disusul garis vertikal menusuk.',
    steps: [
      'Garis vertikal turun, berbelok memutar melengkung besar ke kanan dan naik',
      'Garis melengkung vertikal dari atas menusuk melintasi lengkungan pertama ke bawah',
    ],
  },
  'よ': {
    strokes: 2,
    tips: 'Garis datar pendek, disusul garis vertikal turun dari kanan lalu membuat simpul loop ke kiri.',
    steps: [
      'Garis mendatar pendek dari kiri ke kanan di bagian atas',
      'Garis vertikal dari ujung kanan turun, berputar membuat simpul melingkar lalu mendatar ke kanan',
    ],
  },

  // R-Row
  'ら': {
    strokes: 2,
    tips: 'Titik miring pendek di atas, disusul garis lengkung membulat mirip angka 5 tanpa atap.',
    steps: [
      'Titik miring pendek di bagian atas',
      'Garis vertikal pendek lalu membulat melengkung besar ke kanan dan dasar',
    ],
  },
  'り': {
    strokes: 2,
    tips: 'Garis vertikal kiri pendek dengan kait, lalu garis vertikal kanan panjang melengkung.',
    steps: [
      'Garis vertikal di sisi kiri dengan kait kecil mengarah ke kanan atas',
      'Garis vertikal di sisi kanan lebih panjang, melengkung lembut ke kiri bawah',
    ],
  },
  'る': {
    strokes: 1,
    tips: 'Satu tarikan mendatar, miring ke kiri, lalu lengkungan bulat besar diakhiri simpul lingkaran kecil.',
    steps: [
      'Mendatar ke kanan, serong ke kiri bawah, melengkung membulat besar lalu buat simpul bundar di ujung',
    ],
  },
  'れ': {
    strokes: 2,
    tips: 'Garis vertikal lurus di kiri, garis zig-zag naik lalu melengkung keluar dengan gelombang.',
    steps: [
      'Garis vertikal lurus dari atas ke bawah di sebelah kiri',
      'Garis zig-zag membentuk Z, naik melengkung ke kanan lalu diakhiri gelombang keluar ke kanan',
    ],
  },
  'ろ': {
    strokes: 1,
    tips: 'Persis seperti る tapi tanpa simpul bulat di ujung bawahnya (terbuka).',
    steps: [
      'Tarik mendatar ke kanan, serong ke kiri bawah, lalu melengkung membulat besar ke dasar terbuka',
    ],
  },

  // W & N
  'わ': {
    strokes: 2,
    tips: 'Garis vertikal kiri, lalu garis zig-zag naik membulat besar seperti angka 3 tanpa simpul.',
    steps: [
      'Garis vertikal lurus dari atas ke bawah di sebelah kiri',
      'Garis zig-zag Z naik membulat melengkung lebar ke kanan bawah (tanpa simpul)',
    ],
  },
  'を': {
    strokes: 3,
    tips: 'Garis datar, garis miring belok ke kanan, lalu lengkungan memeluk di bawahnya.',
    steps: [
      'Garis mendatar dari kiri ke kanan di bagian atas',
      'Garis miring dari tengah turun lalu membelok mendatar ke kanan',
      'Garis melengkung memotong seperti huruf C terbalik memeluk bagian bawah',
    ],
  },
  'ん': {
    strokes: 1,
    tips: 'Satu tarikan tunggal miring ke bawah lalu melengkung naik seperti huruf n tulisan bersambung.',
    steps: [
      'Mulai dari atas serong ke kiri bawah, lalu naik melengkung halus dan meluncur ke kanan atas',
    ],
  },
  'っ': {
    strokes: 1,
    tips: 'Mirip つ (tsu) biasa tetapi ditulis berukuran kecil di kuadran kiri bawah.',
    steps: [
      'Garis mendatar sedikit melengkung ke atas, lalu melingkar setengah lingkaran ke kiri bawah dalam ukuran kecil',
    ],
  },
  'ー': {
    strokes: 1,
    tips: 'Satu garis mendatar lurus dari kiri ke kanan (tanda vokal panjang).',
    steps: [
      'Tarik garis mendatar lurus dari kiri ke kanan di bagian tengah',
    ],
  },
};

export const KATAKANA_STROKE_DATA: Record<string, KanaStrokeInfo> = {
  // A-Row
  'ア': {
    strokes: 2,
    tips: 'Garis mendatar belok miring ke kiri, disusul sapuan miring melengkung ke kiri bawah.',
    steps: [
      'Garis mendatar lalu belok tajam miring ke kiri bawah',
      'Garis melengkung dari sudut pertama meluncur ke kiri bawah',
    ],
  },
  'イ': {
    strokes: 2,
    tips: 'Garis miring dari kanan atas ke kiri bawah, lalu garis vertikal lurus turun.',
    steps: [
      'Garis miring dari kanan atas meluncur ke kiri bawah',
      'Garis vertikal lurus turun dari tengah garis pertama',
    ],
  },
  'ウ': {
    strokes: 3,
    tips: 'Titik atas tengah, garis pendek kiri, lalu garis mendatar belok sudut ke kiri bawah.',
    steps: [
      'Titik vertikal pendek di bagian atas tengah',
      'Garis miring pendek di sisi kiri',
      'Garis mendatar dari kiri belok sudut tajam meluncur ke kiri bawah',
    ],
  },
  'エ': {
    strokes: 3,
    tips: 'Garis mendatar atas, garis vertikal tengah, lalu garis mendatar bawah panjang (mirip huruf I kapital).',
    steps: [
      'Garis mendatar pendek di bagian atas',
      'Garis vertikal tengah lurus ke bawah',
      'Garis mendatar panjang sebagai dasar di bawah',
    ],
  },
  'オ': {
    strokes: 3,
    tips: 'Garis mendatar, garis vertikal berkait di ujung, lalu garis miring pemotong ke kanan.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis vertikal lurus turun dari tengah dengan kait kecil ke kiri di ujungnya',
      'Garis miring meluncur dari persimpangan ke kanan bawah',
    ],
  },

  // K-Row
  'カ': {
    strokes: 2,
    tips: 'Garis mendatar belok sudut dengan kait di bawah, lalu garis miring melintang.',
    steps: [
      'Garis mendatar lalu belok sudut turun miring ke kiri dengan kait di ujung',
      'Garis miring melengkung memotong dari kanan atas ke kiri bawah',
    ],
  },
  'キ': {
    strokes: 3,
    tips: 'Dua garis mendatar sejajar, lalu garis miring melengkung menusuk ke kiri bawah.',
    steps: [
      'Garis mendatar atas miring sedikit ke atas',
      'Garis mendatar kedua di bawahnya (lebih panjang)',
      'Garis miring melengkung memotong kedua garis dari atas ke kiri bawah',
    ],
  },
  'ク': {
    strokes: 2,
    tips: 'Garis miring pendek di kiri atas, lalu garis mendatar belok melengkung panjang ke kiri bawah.',
    steps: [
      'Garis miring pendek dari kanan atas ke kiri bawah',
      'Garis mendatar dari ujung garis pertama, belok tajam meluncur melengkung ke kiri bawah',
    ],
  },
  'ケ': {
    strokes: 3,
    tips: 'Garis miring kiri atas, garis mendatar melintang, lalu garis miring melengkung ke kiri bawah.',
    steps: [
      'Garis miring pendek di kiri atas',
      'Garis mendatar memotong dari kiri ke kanan',
      'Garis melengkung dari tengah garis mendatar meluncur ke kiri bawah',
    ],
  },
  'コ': {
    strokes: 2,
    tips: 'Garis mendatar belok vertikal turun, lalu garis mendatar penutup di dasar.',
    steps: [
      'Garis mendatar di bagian atas lalu belok siku 90 derajat turun ke bawah',
      'Garis mendatar dari kiri ke kanan menutup bagian dasar',
    ],
  },

  // S-Row
  'サ': {
    strokes: 3,
    tips: 'Garis mendatar panjang, garis vertikal kiri, lalu garis vertikal kanan melengkung.',
    steps: [
      'Garis mendatar panjang dari kiri ke kanan',
      'Garis vertikal pendek di sebelah kiri menembus garis mendatar',
      'Garis vertikal di sebelah kanan menembus lalu melengkung lembut ke kiri bawah',
    ],
  },
  'シ': {
    strokes: 3,
    tips: 'Dua titik vertikal dari atas ke bawah, lalu sapuan meluncur dari kiri bawah naik ke kanan atas.',
    steps: [
      'Titik miring pertama di sebelah atas',
      'Titik miring kedua sejajar di bawahnya',
      'Sapuan panjang mulai dari kiri bawah meluncur tajam naik ke kanan atas',
    ],
  },
  'ス': {
    strokes: 2,
    tips: 'Garis mendatar belok miring ke kiri, disusul garis miring menusuk ke kanan bawah.',
    steps: [
      'Garis mendatar lalu belok sudut miring meluncur ke kiri bawah',
      'Garis miring memotong dari tengah belokan meluncur ke kanan bawah',
    ],
  },
  'セ': {
    strokes: 2,
    tips: 'Garis mendatar belok kait ke bawah, lalu garis vertikal kiri turun membelok mendatar ke kanan.',
    steps: [
      'Garis mendatar lalu belok turun dengan kait kecil di ujung',
      'Garis vertikal di sisi kiri turun lalu membelok mendatar ke kanan menembus',
    ],
  },
  'ソ': {
    strokes: 2,
    tips: 'Titik miring kiri atas, lalu sapuan dari kanan atas meluncur ke kiri bawah.',
    steps: [
      'Titik miring pendek di kiri atas mengarah ke bawah',
      'Sapuan panjang dari kanan atas meluncur serong ke kiri bawah',
    ],
  },

  // T-Row
  'タ': {
    strokes: 3,
    tips: 'Garis miring pendek di kiri, garis sudut mendatar-melengkung, lalu garis miring di dalam.',
    steps: [
      'Garis miring pendek dari kanan atas ke kiri bawah',
      'Garis mendatar belok sudut melengkung meluncur ke kiri bawah',
      'Garis miring pendek di bagian dalam tengah',
    ],
  },
  'チ': {
    strokes: 3,
    tips: 'Garis miring datar di atas, garis mendatar, lalu garis melengkung memotong ke kiri bawah.',
    steps: [
      'Garis miring mendatar pendek di bagian atas',
      'Garis mendatar dari kiri ke kanan di bawahnya',
      'Garis vertikal memotong dari atas lalu melengkung lembut ke kiri bawah',
    ],
  },
  'ツ': {
    strokes: 3,
    tips: 'Dua titik horizontal di atas, lalu sapuan dari kanan atas meluncur ke kiri bawah.',
    steps: [
      'Titik miring pertama di kiri atas',
      'Titik miring kedua di kanannya sejajar miring',
      'Sapuan panjang dari kanan atas meluncur ke kiri bawah',
    ],
  },
  'テ': {
    strokes: 3,
    tips: 'Garis mendatar pendek atas, garis mendatar panjang, lalu garis melengkung ke kiri bawah.',
    steps: [
      'Garis mendatar pendek di bagian atas',
      'Garis mendatar kedua di bawahnya (lebih panjang)',
      'Garis melengkung dari tengah garis kedua meluncur ke kiri bawah',
    ],
  },
  'ト': {
    strokes: 2,
    tips: 'Garis vertikal lurus, lalu garis miring menempel ke kanan bawah (seperti pohon ranting).',
    steps: [
      'Garis vertikal lurus dari atas ke bawah',
      'Garis miring menempel dari tengah garis vertikal meluncur ke kanan bawah',
    ],
  },

  // N-Row
  'ナ': {
    strokes: 2,
    tips: 'Garis mendatar, lalu garis miring melengkung dari atas menembus ke kiri bawah.',
    steps: [
      'Garis mendatar dari kiri ke kanan',
      'Garis melengkung dari atas menembus garis mendatar meluncur ke kiri bawah',
    ],
  },
  'ニ': {
    strokes: 2,
    tips: 'Dua garis mendatar sejajar, garis atas lebih pendek dari garis bawah.',
    steps: [
      'Garis mendatar pendek di bagian atas',
      'Garis mendatar lebih panjang di bagian bawah',
    ],
  },
  'ヌ': {
    strokes: 2,
    tips: 'Garis mendatar belok sudut ke kanan bawah, disusul garis miring menusuk ke kiri.',
    steps: [
      'Garis mendatar lalu belok sudut miring meluncur ke kanan bawah',
      'Garis miring memotong dari kanan atas meluncur ke kiri bawah',
    ],
  },
  'ネ': {
    strokes: 4,
    tips: 'Titik atas, garis vertikal kiri, garis sudut mendatar, lalu titik miring di kanan bawah.',
    steps: [
      'Titik miring pendek di bagian atas tengah',
      'Garis vertikal lurus di sebelah kiri',
      'Garis mendatar belok sudut miring meluncur ke kiri bawah',
      'Titik miring di sebelah kanan bawah',
    ],
  },
  'ノ': {
    strokes: 1,
    tips: 'Satu sapuan miring melengkung halus dari kanan atas meluncur ke kiri bawah.',
    steps: [
      'Tarik sapuan tunggal melengkung halus dari kanan atas ke kiri bawah',
    ],
  },

  // H-Row
  'ハ': {
    strokes: 2,
    tips: 'Garis miring kiri dan garis miring kanan (seperti angka 8 terbelah atau atap terpisah).',
    steps: [
      'Garis miring pendek di sebelah kiri meluncur ke kiri bawah',
      'Garis miring di sebelah kanan meluncur ke kanan bawah',
    ],
  },
  'ヒ': {
    strokes: 2,
    tips: 'Garis mendatar pendek, lalu garis vertikal turun berbelok melengkung naik ke kanan.',
    steps: [
      'Garis mendatar pendek dari kiri ke kanan di bagian atas',
      'Garis vertikal turun dari ujung kiri, membelok membulat mendatar ke kanan lalu naik sedikit',
    ],
  },
  'フ': {
    strokes: 1,
    tips: 'Satu tarikan mendatar lalu belok melengkung halus ke kiri bawah.',
    steps: [
      'Garis mendatar ke kanan lalu belok melengkung halus meluncur ke kiri bawah',
    ],
  },
  'ヘ': {
    strokes: 1,
    tips: 'Satu tarikan naik pendek lalu turun miring panjang (persis seperti hiragana へ).',
    steps: [
      'Tarik miring naik ke kanan atas, lalu meluncur turun lebih panjang ke kanan bawah',
    ],
  },
  'ホ': {
    strokes: 4,
    tips: 'Garis mendatar atas, garis vertikal berkait di ujung, lalu dua garis miring di kiri dan kanan.',
    steps: [
      'Garis mendatar dari kiri ke kanan di bagian atas',
      'Garis vertikal lurus turun memotong dengan kait kecil di bawah',
      'Garis miring pendek di sisi kiri meluncur ke kiri bawah',
      'Garis miring pendek di sisi kanan meluncur ke kanan bawah',
    ],
  },

  // M-Row
  'マ': {
    strokes: 2,
    tips: 'Garis mendatar belok sudut ke kiri bawah, disusul garis miring pendek di kanan.',
    steps: [
      'Garis mendatar lalu belok sudut miring tajam ke kiri bawah',
      'Garis miring pendek di sisi kanan meluncur ke kanan bawah',
    ],
  },
  'ミ': {
    strokes: 3,
    tips: 'Tiga garis miring pendek sejajar dari atas ke bawah (garis paling bawah paling panjang).',
    steps: [
      'Garis miring pendek pertama di bagian atas',
      'Garis miring pendek kedua di bagian tengah',
      'Garis miring ketiga di bagian bawah sedikit lebih panjang',
    ],
  },
  'ム': {
    strokes: 2,
    tips: 'Garis miring belok mendatar ke kanan, disusul titik miring di kanan.',
    steps: [
      'Garis miring dari atas ke kiri bawah lalu belok tajam mendatar ke kanan',
      'Titik miring pendek di sisi kanan atas',
    ],
  },
  'メ': {
    strokes: 2,
    tips: 'Garis miring panjang dari kanan atas ke kiri bawah, disusul garis miring memotong dari kiri atas.',
    steps: [
      'Garis miring melengkung dari kanan atas meluncur ke kiri bawah',
      'Garis miring pendek dari kiri atas memotong garis pertama ke kanan bawah',
    ],
  },
  'モ': {
    strokes: 3,
    tips: 'Dua garis mendatar sejajar, lalu garis vertikal turun membelok ke kanan di bawah.',
    steps: [
      'Garis mendatar atas dari kiri ke kanan',
      'Garis mendatar kedua di bawahnya (sedikit lebih panjang)',
      'Garis vertikal lurus menembus kedua garis datar lalu membelok mendatar ke kanan',
    ],
  },

  // Y-Row
  'ヤ': {
    strokes: 2,
    tips: 'Garis mendatar belok sudut miring ke kiri, disusul garis vertikal menusuk lurus.',
    steps: [
      'Garis mendatar lalu belok sudut meluncur ke kiri bawah',
      'Garis vertikal lurus turun memotong garis pertama',
    ],
  },
  'ユ': {
    strokes: 2,
    tips: 'Garis mendatar belok siku turun, lalu garis mendatar panjang menutup di bawah.',
    steps: [
      'Garis mendatar lalu belok sudut siku 90 derajat turun ke bawah',
      'Garis mendatar panjang dari kiri ke kanan menembus garis vertikal di dasar',
    ],
  },
  'ヨ': {
    strokes: 3,
    tips: 'Garis sudut mendatar turun, garis mendatar tengah, lalu garis mendatar bawah (seperti huruf E terbalik).',
    steps: [
      'Garis mendatar atas lalu belok vertikal turun ke bawah',
      'Garis mendatar di bagian tengah menempel ke garis vertikal',
      'Garis mendatar di bagian bawah menutup dasar',
    ],
  },

  // R-Row
  'ラ': {
    strokes: 2,
    tips: 'Garis mendatar pendek di atas, lalu garis mendatar belok melengkung ke kiri bawah.',
    steps: [
      'Garis mendatar pendek di bagian atas',
      'Garis mendatar di bawahnya lalu belok melengkung halus meluncur ke kiri bawah',
    ],
  },
  'リ': {
    strokes: 2,
    tips: 'Garis vertikal kiri pendek, lalu garis vertikal kanan panjang melengkung lembut.',
    steps: [
      'Garis vertikal pendek di sebelah kiri',
      'Garis vertikal di sebelah kanan lebih panjang, sedikit melengkung di ujung bawah',
    ],
  },
  'ル': {
    strokes: 2,
    tips: 'Garis miring kiri, disusul garis vertikal belok melengkung naik dengan kait di ujung.',
    steps: [
      'Garis miring dari atas meluncur ke kiri bawah',
      'Garis vertikal di kanan turun lalu membelok melengkung naik dengan kait di ujungnya',
    ],
  },
  'レ': {
    strokes: 1,
    tips: 'Satu tarikan vertikal turun lalu membelok tajam meluncur naik ke kanan atas.',
    steps: [
      'Tarik vertikal lurus turun, lalu belok tajam meluncur naik ke kanan atas',
    ],
  },
  'ロ': {
    strokes: 3,
    tips: 'Garis vertikal kiri, garis sudut mendatar turun kanan, lalu garis mendatar penutup bawah (kotak sempurna).',
    steps: [
      'Garis vertikal di sisi kiri turun ke bawah',
      'Garis mendatar atas lalu belok siku turun ke bawah di sisi kanan',
      'Garis mendatar menutup bagian dasar dari kiri ke kanan',
    ],
  },

  // W & N
  'ワ': {
    strokes: 2,
    tips: 'Garis vertikal pendek di kiri, lalu garis mendatar belok melengkung ke kiri bawah.',
    steps: [
      'Garis vertikal pendek di sisi kiri',
      'Garis mendatar atas dari ujung garis pertama, belok melengkung halus meluncur ke kiri bawah',
    ],
  },
  'ヲ': {
    strokes: 3,
    tips: 'Dua garis mendatar, lalu garis miring melengkung memotong.',
    steps: [
      'Garis mendatar pendek di bagian atas',
      'Garis mendatar kedua lalu belok sudut miring ke kiri bawah',
      'Garis melengkung memotong dari kanan atas ke kiri bawah',
    ],
  },
  'ン': {
    strokes: 2,
    tips: 'Titik miring di kiri, lalu sapuan meluncur dari kiri bawah tajam naik ke kanan atas.',
    steps: [
      'Titik miring pendek di sebelah kiri atas',
      'Sapuan panjang dari kiri bawah meluncur tajam naik ke kanan atas',
    ],
  },
  'ッ': {
    strokes: 3,
    tips: 'Mirip ツ (tsu) biasa tetapi ditulis berukuran kecil di kuadran kiri bawah.',
    steps: [
      'Titik miring pendek di kiri atas',
      'Titik miring pendek kedua di tengah',
      'Sapuan melengkung dari kanan atas meluncur ke kiri bawah',
    ],
  },
  'ー': {
    strokes: 1,
    tips: 'Satu garis mendatar lurus dari kiri ke kanan (chōonpu tanda vokal panjang).',
    steps: [
      'Tarik garis mendatar lurus dari kiri ke kanan di bagian tengah',
    ],
  },
};

/**
 * Get stroke information for any kana (Hiragana or Katakana),
 * including automatic calculation for Dakuten and Handakuten!
 */
export function getKanaStrokeInfo(char: string): KanaStrokeInfo {
  if (HIRAGANA_STROKE_DATA[char]) {
    return HIRAGANA_STROKE_DATA[char];
  }
  if (KATAKANA_STROKE_DATA[char]) {
    return KATAKANA_STROKE_DATA[char];
  }

  // Handle Dakuten (e.g. が, ざ, だ, ば / ガ, ザ, etc. = base + 2 strokes)
  const DAKUTEN_CHARS = 'がぎぐげござじずぜぞだぢづでどばびぶべぼガギグゲゴザジズゼゾダヂヅデドバビブベボ';
  if (DAKUTEN_CHARS.includes(char)) {
    return {
      strokes: 4, // average approx
      tips: 'Tulis huruf dasar terlebih dahulu, kemudian tambahkan dua tanda petik (dakuten ゛) di kanan atas.',
      steps: [
        'Tulis huruf kana dasarnya',
        'Tambahkan coretan petik pertama di kanan atas',
        'Tambahkan coretan petik kedua sejajar di sampingnya',
      ],
    };
  }

  // Handle Handakuten (e.g. ぱぴぷぺぽ / パピプペポ = base + 1 stroke circle)
  const HANDAKUTEN_CHARS = 'ぱぴぷぺぽパピプペポ';
  if (HANDAKUTEN_CHARS.includes(char)) {
    return {
      strokes: 4,
      tips: 'Tulis huruf dasar terlebih dahulu, kemudian tambahkan lingkaran kecil (handakuten ゜) di kanan atas.',
      steps: [
        'Tulis huruf kana dasarnya',
        'Tambahkan lingkaran kecil (maru) di kanan atas',
      ],
    };
  }

  // Fallback
  return {
    strokes: 2,
    tips: 'Perhatikan proporsi dan arah tarikan coretan dari kiri ke kanan dan atas ke bawah.',
    steps: ['Ikuti bentuk karakter sesuai contoh panduan'],
  };
}
