

with validation as (

    select
        total_losses as positive

    from "postgres"."public"."wins_losses"

),

validation_errors as (

    select
        positive 

    from validation
    -- if this is true, then positive is actually negative!
    where positive < 0

)

select *
from validation_errors

