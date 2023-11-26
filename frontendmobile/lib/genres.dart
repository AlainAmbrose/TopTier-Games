class Genres {
  final int id;
  final String title;
  final String href;
  final List<int> data;

  const Genres({
    required this.id,
    required this.title,
    required this.href,
    required this.data,
  });
}

const List<Genres> genres = [
  Genres(id: 2, title: "Point-and-click", href: "/#", data: []),
  Genres(id: 4, title: "Fighting", href: "/#", data: []),
  Genres(id: 5, title: "Shooter", href: "/#", data: []),
  Genres(id: 7, title: "Music", href: "/#", data: []),
  Genres(id: 8, title: "Platform", href: "/#", data: []),
  Genres(id: 9, title: "Puzzle", href: "/#", data: []),
  Genres(id: 10, title: "Racing", href: "/#", data: []),
  Genres(id: 11, title: "Real Time Strategy (RTS)", href: "/#", data: []),
  Genres(id: 12, title: "Role-playing (RPG)", href: "/#", data: []),
  Genres(id: 13, title: "Simulator", href: "/#", data: []),
  Genres(id: 14, title: "Sport", href: "/#", data: []),
  Genres(id: 15, title: "Strategy", href: "/#", data: []),
  Genres(id: 16, title: "Turn-based strategy (TBS)", href: "/#", data: []),
  Genres(id: 24, title: "Tactical", href: "/#", data: []),
  Genres(id: 25, title: "Hack and slash/Beat 'em up", href: "/#", data: []),
  Genres(id: 26, title: "Quiz/Trivia", href: "/#", data: []),
  Genres(id: 30, title: "Pinball", href: "/#", data: []),
  Genres(id: 31, title: "Adventure", href: "/#", data: []),
  Genres(id: 32, title: "Indie", href: "/#", data: []),
  Genres(id: 33, title: "Arcade", href: "/#", data: []),
  Genres(id: 34, title: "Visual Novel", href: "/#", data: []),
  Genres(id: 35, title: "Card & Board Game", href: "/#", data: []),
  Genres(id: 36, title: "MOBA", href: "/#", data: []),
];