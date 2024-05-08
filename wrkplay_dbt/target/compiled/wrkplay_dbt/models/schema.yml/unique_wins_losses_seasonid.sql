
    
    

select
    seasonid as unique_field,
    count(*) as n_records

from "postgres"."public"."wins_losses"
where seasonid is not null
group by seasonid
having count(*) > 1


