select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select gameid
from "postgres"."public"."wins_losses"
where gameid is null



      
    ) dbt_internal_test