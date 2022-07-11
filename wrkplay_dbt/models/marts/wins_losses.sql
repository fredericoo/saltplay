--number of wins and losses per player per game (per office) per season
WITH loss_table AS (
	SELECT
		SUM(lt.left_losses) AS "total_losses"
		, lt.left_player_id AS "loss_player_id"
		, lt.gameid
		, lt.seasonid
	FROM
		(
			SELECT
				*
			FROM
				(
					--Begin DONE
					WITH left_count AS (
						SELECT
							AVG(CASE
		WHEN m.leftscore > m.rightscore THEN 0
		ELSE 1
	END) AS "left_loss"
							, l."A"
							, l."B"
							, m."gameid"
							, m."seasonid"
						FROM
							"_left" l
						JOIN "Match" m ON
							l."A" = m.id
						GROUP BY
							l."A"
							, l."B"
							, m."gameid"
							, m."seasonid"
					)
					SELECT
						SUM(a.left_loss) AS "left_losses"
						, a."B" AS "left_player_id"
						, a."gameid"
						, a."seasonid"
					FROM
						left_count a
					GROUP BY
						a."B"
						, a."gameid"
						, a."seasonid"
						--End DONE
				) ll
		UNION ALL
			SELECT
				*
			FROM
				(
					--Begin DONE
					WITH right_count AS (
						SELECT
							AVG(CASE
		WHEN m.leftscore < m.rightscore THEN 0
		ELSE 1
	END) AS "right_loss"
							, r."A"
							, r."B"
							, m."gameid"
							, m."seasonid"
						FROM
							"_right" r
						JOIN "Match" m ON
							r."A" = m.id
						GROUP BY
							r."A"
							, r."B"
							, m."gameid"
							, m."seasonid"
					)
					SELECT
						SUM(a.right_loss) AS "right_losses"
						, a."B" AS "right_player_id"
						, a."gameid"
						, a."seasonid"
					FROM
						right_count a
					GROUP BY
						a."B"
						, a."gameid"
						, a."seasonid"
						--End DONE
				) rl
		) lt
		--	WHERE lt.left_player_id = '<insert player id here for specific player stats>'
	GROUP BY
		lt.left_player_id
		, lt.gameid
		, lt.seasonid
)
,
win_table AS (
	--number of wins for a player and gameid
	SELECT
		SUM(rt.right_wins) AS "total_wins"
		, rt.right_player_id AS "win_player_id"
		, rt.gameid
		, rt."seasonid"
	FROM
		(
			SELECT
				*
			FROM
				(
					WITH right_count AS (
						SELECT
							AVG(CASE
		WHEN m.leftscore < m.rightscore THEN 1
		ELSE 0
	END) AS "right_won"
							, r."A"
							, r."B"
							, m."gameid"
							, m."seasonid"
						FROM
							"_right" r
						JOIN "Match" m ON
							r."A" = m.id
						GROUP BY
							r."A"
							, r."B"
							, m."gameid"
							, m."seasonid"
					)
					SELECT
						SUM(a.right_won) AS "right_wins"
						, a."B" AS "right_player_id"
						, a."gameid"
						, a."seasonid"
					FROM
						right_count a
					GROUP BY
						a."B"
						, a."gameid"
						, a."seasonid"
				) rw
		UNION ALL
			SELECT
				*
			FROM
				(
					WITH left_count AS (
						SELECT
							AVG(CASE
		WHEN m.leftscore > m.rightscore THEN 1
		ELSE 0
	END) AS "left_won"
							, l."A"
							, l."B"
							, m."gameid"
							, m."seasonid"
						FROM
							"_left" l
						JOIN "Match" m ON
							l."A" = m.id
						GROUP BY
							l."A"
							, l."B"
							, m."gameid"
							, m."seasonid"
					)
					SELECT
						SUM(a.left_won) AS "left_wins"
						, a."B" AS "left_player_id"
						, a."gameid"
						, a."seasonid"
					FROM
						left_count a
					GROUP BY
						a."B"
						, a."gameid"
						, a."seasonid"
				) lw
		) rt
		-- WHERE rt.right_player_id = '<insert player id here for specific player stats>'
	GROUP BY
		rt.right_player_id
		, rt.gameid
		, rt."seasonid"
)
SELECT
	COALESCE(lt.loss_player_id, wt.win_player_id) AS "player_id"
	, COALESCE(lt."gameid", wt."gameid") AS "gameid"
	, COALESCE(lt.seasonid, wt.seasonid) AS "seasonid"
	, wt."total_wins"
	, lt."total_losses"
FROM
	loss_table lt
FULL OUTER JOIN win_table wt ON
	lt."loss_player_id" = wt."win_player_id"
	AND lt."gameid" = wt."gameid"
	AND lt."seasonid" = wt."seasonid"
