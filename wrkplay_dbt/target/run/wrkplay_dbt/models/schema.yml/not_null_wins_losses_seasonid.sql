select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select seasonid
from "postgres"."public"."wins_losses"
where seasonid is null



      
    ) dbt_internal_test