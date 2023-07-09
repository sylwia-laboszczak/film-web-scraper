import { deduplicateAndSortByRating } from "./main";

describe("DeduplicatAndSortByRating test", () => {
  test("Should return empty result when empty array provided", () => {
    // given
    const input = [];

    // when
    var result = deduplicateAndSortByRating(input);

    // then
    expect(result.length).toBe(0);
  });

  test("Should return sorted movies", () => {
    // given
    const input = [
      { title: "Nimona", rating: 7.35, platform: "netflix" },
      { title: "Fenomen", rating: 7.5, platform: "disney" },
      { title: "Zaopiekujcie się Mayą", rating: 7.08, platform: "hbo_max" },
    ];

    // when
    var result = deduplicateAndSortByRating(input);

    // then
    expect(result.length).toBe(3);
    expect(result[0][0]).toBe("Fenomen");
    expect(result[0][2]).toBe(7.5);
    expect(result[1][0]).toBe("Nimona");
    expect(result[1][2]).toBe(7.35);
    expect(result[2][0]).toBe("Zaopiekujcie się Mayą");
    expect(result[2][2]).toBe(7.08);
  });

  test("Should return uniqe movies with highest rating", () => {
    // given
    const input = [
      { title: "Nimona", rating: 7.35, platform: "netflix" },
      { title: "Nimona", rating: 7.5, platform: "disney" },
      { title: "Nimona", rating: 7.08, platform: "hbo_max" },
      { title: "Fenomen", rating: 7.22, platform: "hbo_max" },
    ];

    // when
    var result = deduplicateAndSortByRating(input);

    // then
    expect(result.length).toBe(2);
    expect(result[0][0]).toBe("Nimona");
    expect(result[0][2]).toBe(7.5);
    expect(result[1][0]).toBe("Fenomen");
    expect(result[1][2]).toBe(7.22);
  });
});
