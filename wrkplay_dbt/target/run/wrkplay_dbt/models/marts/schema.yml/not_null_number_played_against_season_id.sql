select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select season_id
from "postgres"."public"."number_played_against"
where season_id is null



      
    ) dbt_internal_test