
  create view "postgres"."public"."number_played_against__dbt_tmp" as (
    -- gets the number of players a player has played against or with per season
SELECT
	c."b1" AS "player_id"
	, c."season_id" AS "season_id"
	, count(DISTINCT c."b2") AS "num_played_against"
FROM
	(
		WITH all_players AS (
			SELECT
				l."A" AS "match_id"
				, l."B" AS "player_id"
				, s.slug AS "season_id"
			FROM
				"_left" l
			JOIN "Match" m ON l."A" = m.id 
			JOIN "Season" s ON m.seasonid = s.id 
		UNION ALL
			SELECT
				r."A" AS "r_A"
				, r."B" AS "r_B"
				, s.slug AS "r_season_id"
			FROM
				"_right" r
			JOIN "Match" m ON r."A" = m.id 
			JOIN "Season" s ON m.seasonid = s.id 
		)
		SELECT
			a1."player_id" AS "b1"
			, a2."player_id" AS "b2"
			, a1."season_id" AS "season_id"
		FROM
			all_players a1
		JOIN all_players a2 ON
			a1."match_id" = a2."match_id"
	) c
WHERE
	c."b1" <> c."b2"
GROUP BY
	c."b1"
	, c."season_id"
  );