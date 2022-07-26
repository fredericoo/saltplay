select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select num_played_against
from "postgres"."public"."number_played_against"
where num_played_against is null



      
    ) dbt_internal_test